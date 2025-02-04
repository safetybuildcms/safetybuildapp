import { SupabaseClient } from '@supabase/supabase-js'
import { StorageServiceImplementer } from '../implementer'
import { StorageResult } from '../results'
import { Storable } from '../storable'
import { Relation } from '../../../types/relation'

export const getAndDeleteField = <T extends Storable, R>(item: T, name: string): R => {
  let value = item[name]
  delete item[name]
  return value
}

export class SupabaseDatabaseServiceImplementer extends StorageServiceImplementer {
  constructor(private readonly supabase: SupabaseClient) {
    super()
  }

  private _uid: string | undefined

  get uid() {
    if (this._uid === undefined) {
      throw Error('Uid not initialized')
    }
    return this._uid
  }

  /**
   * generateId shouldn't be required for sql databases
   */
  generateId(): string {
    throw new Error('Method not implemented.')
  }
  async initialize(): Promise<void> {
    this._uid = (await this.supabase.auth.getUser()).data.user?.id
  }
  async save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>> {
    let typeName = getAndDeleteField<T, string>(item, 'typeName').toLowerCase()
    console.log('insert item', item)
    let { data, error, status, statusText } = await this.supabase.from(typeName).insert(item).select('*')

    item.typeName = typeName

    if (error?.message) {
      return { error: error.message }
    }

    if (status < 200 || status >= 300) {
      return { error: `Insert ${typeName} failed: ${status} - ${statusText}` }
    }

    console.log('data', data)

    if (!data || data.length === 0) {
      return { error: 'No data returned from insert' }
    }

    console.log('data', data)

    // todo - should be handled by unpack?
    data[0].typeName = typeName

    return { data: data[0] }
  }
  async update<T extends Storable>(item: T): Promise<StorageResult<T>> {
    throw new Error('Method not implemented.')
  }
  async delete<T extends Storable>(item: T): Promise<StorageResult<T>> {
    throw new Error('Method not implemented.')
  }
  async load<T extends Storable>(
    type: T | string,
    id?: string | number,
    relationName?: string
  ): Promise<StorageResult<T>> {
    relationName = relationName ?? 'id'
    let typeName = this.typeNameOf(type).toLowerCase()
    let { data, error } = await this.supabase.from(typeName).select('*').eq(relationName, id)
    if (error) {
      return { error: error.message }
    }
    if (!data || data.length === 0) {
      return { error: 'No data returned from load' }
    }
    data[0].typeName = typeName
    return { data: data[0] as T }
  }
}
