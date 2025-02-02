import { StorageServiceImplementer } from './implementer'
import { storageError, StorageResult } from './results'
import { Storable } from './storable'

import { getRegisteredStorables } from './storable'
import { onStorageEvent } from './events'
import { SupabaseClient } from '@supabase/supabase-js'

export type UUIDProvider = () => string

export class SupabaseStorageService extends StorageServiceImplementer {
  /**
   * @param uuidProvider - A function that returns a UUID. Varies by environment because React Native doesn't have crypto.
   * @param bucketPrefix - The prefix for the bucket to store the data in, eg, dev, prod, uuid
   */
  constructor(
    public readonly uuidProvider: UUIDProvider,
    public readonly supabaseClient: SupabaseClient,
    public readonly bucketPrefix: string = ''
  ) {
    super()
    console.log('bucketPrefix:', bucketPrefix)
    let prefix = bucketPrefix + (bucketPrefix.length > 0 ? (bucketPrefix.slice(-1) === '_' ? '' : '_') : '')
    this.bucketPrefix = prefix
  }

  generateId(): string {
    return this.uuidProvider().slice(0, 8)
  }

  protected _adminClient: SupabaseClient | undefined
  get adminClient() {
    if (!this._adminClient) {
      throw new Error('Admin client not set')
    }
    return this._adminClient
  }
  set adminClient(client: SupabaseClient) {
    this._adminClient = client
  }

  getBucketName(typeName: string) {
    return this.bucketPrefix + typeName
  }

  /**
   * Initializes the storage service by creating the necessary directories for each type.
   * This is only necessary during setup.
   * If adminClient is not set, no setup will be performed.
   */
  async initialize() {
    if (!this._adminClient) return

    let buckets = await this.adminClient.storage.listBuckets()

    if (buckets.error) {
      console.error('Error listing buckets', buckets.error)
      return
    }

    for (let typeName of getRegisteredStorables().keys()) {
      let bucketName = this.getBucketName(typeName)
      if (buckets.data.find((bucket) => bucket.name === bucketName)) {
        console.log('Bucket already exists', bucketName)
        continue
      }
      console.log('Creating bucket', bucketName, '...')
      let { data, error } = await this.adminClient.storage.createBucket(bucketName)
      if (error) {
        console.error('Error creating bucket', typeName, error)
      }
    }
  }

  async save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>> {
    let blobPath = this.getItemPath<T>(item)
    let bucketName = this.getBucketName(item.typeName)

    let { data, error } = await this.supabaseClient.storage.from(bucketName).list(blobPath)
    if (error) return storageError(error)
    let exists = data?.length ?? 0 > 0

    if (exists && overwrite !== true) return storageError('File Exists.')

    try {
      await this.supabaseClient.storage.from(bucketName).upload(blobPath, JSON.stringify(item, null, 2))
      console.log('saved', item.typeName, 'to', blobPath)
      // fire event after returning result
      queueMicrotask(() => onStorageEvent(item, 'save'))
      return { data: item }
    } catch (e) {
      return storageError(e)
    }
  }

  private getItemPath<T extends Storable>(item: T | string, id?: string | number) {
    id = this.idOf(item, id)
    if (id === undefined) throw Error('id should be defined.')
    return `${id}.json`
  }

  async update<T extends Storable>(item: T): Promise<StorageResult<T>> {
    return this.save(item, true)
  }

  async delete<T extends Storable>(item: T): Promise<StorageResult<T>> {
    let blobPath = this.getItemPath(item)
    let bucketName = this.getBucketName(item.typeName)
    // if (!fs.existsSync(blobPath)) return storageError(`No file at ${blobPath}`)
    try {
      await this.supabaseClient.storage.from(bucketName).remove([blobPath])
      return { data: item }
    } catch (e) {
      return storageError(e)
    }
  }

  protected async loadItem<T extends Storable>(type: T | string, id: string | number): Promise<StorageResult<T>> {
    let bucketName = this.getBucketName(this.typeNameOf(type))
    let blobPath = this.getItemPath(type, id)
    // if (!fs.existsSync(blobPath)) return storageError(`No file at ${blobPath}`)
    try {
      console.log(`loading ${blobPath}`)
      let { data, error } = await this.supabaseClient.storage.from(bucketName).download(blobPath)
      if (error) return storageError(error)

      let text = data ? new TextDecoder().decode(await data.arrayBuffer()) : undefined

      if (!text) return storageError(`No data returned from download from ${blobPath}`)

      let item = JSON.parse(text)
      return { data: item }
    } catch (e) {
      return storageError(e)
    }
  }

  protected async loadList<T extends Storable>(type: T | string): Promise<StorageResult<T>> {
    let typeName = this.typeNameOf(type)
    let bucketName = this.getBucketName(typeName)
    // let blobPath = `${typeName}/`
    // if (!fs.existsSync(blobPath)) return storageError(`No directory at ${blobPath}`)
    try {
      let { data, error } = await this.supabaseClient.storage.from(bucketName).list('')
      if (error) return storageError(error)

      let items = []
      for (let item of data ?? []) {
        let { data, error } = await this.supabaseClient.storage.from(bucketName).download(item.name)
        if (error) return storageError(error)
        let text = data ? new TextDecoder().decode(await data.arrayBuffer()) : undefined
        if (!text) return storageError(`No data returned from download from ${item.name}`)
        items.push(JSON.parse(text))
      }
      return { data: items }
    } catch (e) {
      return storageError(e)
    }
  }

  async load<T extends Storable>(type: T | string, id?: string | number): Promise<StorageResult<T>> {
    if (id === undefined) {
      return this.loadList(type)
    } else {
      return this.loadItem(type, id)
    }
  }
}
