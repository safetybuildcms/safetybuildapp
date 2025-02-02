import { StorageServiceImplementer } from './implementer'
import { storageError, StorageResult } from './results'
import { Storable } from './storable'
import fs from 'node:fs'
import path from 'node:path'

import { getRegisteredStorables } from './storable'
import { onStorageEvent } from './events'

export class NodeFsStorageService extends StorageServiceImplementer {
  private _storageRoot: string

  constructor(storageRoot: string) {
    super()
    this._storageRoot = storageRoot
  }

  generateId(): string {
    return crypto.randomUUID().slice(0, 8)
  }

  get storageRoot() {
    return this._storageRoot
  }

  async initialize() {
    for (let typeName of getRegisteredStorables().keys()) {
      fs.mkdirSync(path.join(this._storageRoot, typeName), { recursive: true })
    }
  }

  async save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>> {
    let blobPath = this.getItemPath<T>(item)

    let exists = fs.existsSync(blobPath)

    if (exists && overwrite !== true) return storageError('File Exists.')

    try {
      await fs.promises.writeFile(blobPath, JSON.stringify(item, null, 2))
      console.log('saved', item.typeName, 'to', blobPath)
      // fire event after returning result
      queueMicrotask(() => onStorageEvent(item, 'save'))
      return { data: item }
    } catch (e) {
      return storageError(e)
    }
  }

  private getItemPath<T extends Storable>(item: T | string, id?: string | number) {
    let typeName = this.typeNameOf(item)
    id = this.idOf(item, id)
    return path.join(this._storageRoot, typeName, `${id}.json`)
  }

  async update<T extends Storable>(item: T): Promise<StorageResult<T>> {
    return this.save(item, true)
  }

  async delete<T extends Storable>(item: T): Promise<StorageResult<T>> {
    let blobPath = this.getItemPath(item)
    if (!fs.existsSync(blobPath)) return storageError(`No file at ${blobPath}`)
    try {
      await fs.promises.unlink(blobPath)
      return { data: item }
    } catch (e) {
      return storageError(e)
    }
  }

  protected async loadItem<T extends Storable>(type: T | string, id: string | number): Promise<StorageResult<T>> {
    let typeName = this.typeNameOf(type)
    let blobPath = this.getItemPath(typeName, id)
    if (!fs.existsSync(blobPath)) return storageError(`No file at ${blobPath}`)
    try {
      console.log(`loading ${blobPath}`)
      let item = JSON.parse(fs.readFileSync(blobPath, 'utf8'))
      return { data: item }
    } catch (e) {
      return storageError(e)
    }
  }

  protected async loadList<T extends Storable>(type: T | string): Promise<StorageResult<T>> {
    let typeName = this.typeNameOf(type)
    let blobPath = path.join(this._storageRoot, typeName)
    if (!fs.existsSync(blobPath)) return storageError(`No directory at ${blobPath}`)
    try {
      let items = fs.readdirSync(blobPath).map((file) => JSON.parse(fs.readFileSync(path.join(blobPath, file), 'utf8')))
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
