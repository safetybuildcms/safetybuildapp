import { isIRecord, isIRecordArray } from '../../types/IRecord'
import { StorageServiceImplementer } from './implementer'
import { StorageResult } from './results'
import { Storable } from './storable'

const LOOKUP_FIELD_KEY = '_lookupFields'

type LookupField = {
  key: string
  typeName: string
}

export class StorageService {
  private _serviceImplementer: StorageServiceImplementer

  constructor(implementation: StorageServiceImplementer) {
    this._serviceImplementer = implementation
  }

  get implementation(): StorageServiceImplementer {
    return this._serviceImplementer
  }

  generateId(): string {
    return this.implementation.generateId()
  }

  initialize(): Promise<void> {
    return this.implementation.initialize()
  }

  /**
   * Transforms array elements to their pk values.
   * todo: save items found using isIRecordArray and isIRecord
   */
  protected pack<T extends Storable>(item: T): any {
    let result: Record<string, any> = {}

    let lookupFields: LookupField[] = []
    if (LOOKUP_FIELD_KEY in item) {
      lookupFields = item[LOOKUP_FIELD_KEY]
    }
    for (let key of Object.keys(item)) {
      let value = item[key]
      if (isIRecordArray(value)) {
        if (value.length === 0) {
          result[key] = []
          continue
        }
        result[key] = value.map((item) => item.id)
        lookupFields.push({ key, typeName: value[0].typeName })
      } else if (isIRecord(value)) {
        result[key] = value.id
        lookupFields.push({ key, typeName: value.typeName })
      } else {
        result[key] = value
      }
      if (lookupFields.length > 0) {
        result[LOOKUP_FIELD_KEY] = lookupFields
      }
    }
    return result
  }

  protected async unpack<T extends Storable>(item: Record<string, any>): Promise<StorageResult<T>> {
    let result: Record<string, any> = {}
    let lookupFields: LookupField[] = item[LOOKUP_FIELD_KEY] ?? []

    for (let lookupField of lookupFields) {
      let value = item[lookupField.key]
      if (Array.isArray(value)) {
        // todo - maintain in memory cache of loaded items + some kind of journaling for updates to reduce write latency
        // note that as this is an implementation detail, it would probably be implemented by StorageServiceImplementor
        // todo - consider storing sub items in same file, might be more efficient for io
        result[lookupField.key] = []
        for (let id of value) {
          let itemLoad = await this.load(lookupField.typeName, id)
          if ('error' in itemLoad) {
            return { error: `Failed to load ${lookupField.typeName} with id ${id}: ${itemLoad.error}`, data: undefined }
          }
          let { data: item } = itemLoad
          result[lookupField.key].push(item)
        }
      } else if (isIRecord(value)) {
        result[lookupField.key] = await this.load(lookupField.typeName, value.id)
      }
    }

    for (let key of Object.keys(item)) {
      if (!(key in result) && key !== LOOKUP_FIELD_KEY) {
        result[key] = item[key]
      }
    }

    return { data: result as T }
  }

  save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>> {
    return this.implementation.save(this.pack(item), overwrite)
  }

  update<T extends Storable>(item: T): Promise<StorageResult<T>> {
    return this.implementation.update(item)
  }

  delete<T extends Storable>(item: T): Promise<StorageResult<T>> {
    return this.implementation.delete(item)
  }

  async load<T extends Storable>(type: T | string, id?: string | number): Promise<StorageResult<T>> {
    let result = await this.implementation.load(type, id)
    if ('error' in result) {
      return result
    }

    let unpacked = await this.unpack<any>(result.data)
    if ('error' in unpacked) {
      return unpacked
    }

    return { data: unpacked.data as T }
  }
}
