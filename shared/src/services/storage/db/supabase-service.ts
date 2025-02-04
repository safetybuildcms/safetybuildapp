import { Relation } from '../../../types/relation'
import { StorageResult } from '../results'
import { StorageService } from '../service'
import { getRegisteredStorables, registeredSingularOf, Storable } from '../storable'
import { getAndDeleteField, SupabaseDatabaseServiceImplementer } from './supabase-service-implementer'

export class SupabaseDatabaseService extends StorageService {
  constructor(implementation: SupabaseDatabaseServiceImplementer) {
    super(implementation)
  }

  override initialize(): Promise<void> {
    return this.implementation.initialize()
  }

  /**
   * Translates fieldnames to db column names
   * Lowercase characters after underscore and add underscores
   * @param field
   * @returns
   */
  protected toColumnName(field: string): string {
    return field.replace(/([A-Z])/g, '_$1').toLowerCase()
  }

  /**
   * Translates db column names to fieldnames
   * Capitalize charactrers after underscore and remove underscores
   * @param column
   * @returns
   */
  protected fromColumnName(column: string): string {
    return column.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase())
  }

  /**
   * Translates fieldnames to db column names
   * Translates relations to related records and stores in _relat
   *
   * @param item
   * @returns
   */
  protected pack<T extends Storable>(item: T): Storable {
    let sampleType = getRegisteredStorables().get(item.typeName)!

    let typeName = item.typeName
    let _relations: Record<string, Relation<unknown>> = {}
    let result: Record<string, any> = { typeName, _relations }
    for (let key in item) {
      if (key === 'typeName') {
        continue
      }
      if ((item[key] as any) instanceof Relation) {
        _relations[key] = item[key]
        continue
      }
      result[this.toColumnName(key)] = item[key]
    }
    if ('uid' in sampleType && !('uid' in result)) {
      result.uid = (this.implementation as SupabaseDatabaseServiceImplementer).uid
    }
    return result as Storable
  }

  protected async unpack<T extends Storable>(item: Record<string, any>): Promise<StorageResult<T>> {
    let result: Record<string, any> = {}
    let relations: Record<string, Relation<Storable>> = item['_relations']
    let typeName = item['typeName']

    let errors: (Error | string)[] | undefined
    if (relations) {
      for (let [relationName, relation] of Object.entries(relations)) {
        let relationTypeName = registeredSingularOf(relationName)
        let relationEntries = new Relation<T>()
        let id_clause = `${typeName}_id`
        let { data, error } = await this.implementation.load(relationTypeName, item.id, id_clause)
        if (error) {
          if (!errors) {
            errors = []
          }
          errors.push(error)
        } else {
          relationEntries.push(data as T)
        }
        result[relationName] = relationEntries
      }
    }

    if (errors) {
      return { error: new Error(errors.map((e) => (e instanceof Error ? e.message : e)).join('\n')) }
    }

    for (let key of Object.keys(item)) {
      if (key === 'typeName') {
        continue
      }
      result[this.fromColumnName(key)] = item[key]
    }

    result.typeName = typeName

    return { data: result as T }
  }

  override async save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>> {
    let packed = this.pack(item)
    let _relations: Record<string, Relation<Storable>> = getAndDeleteField(packed, '_relations')
    let { data, error } = await this.implementation.save(packed, overwrite)
    if (error) {
      return { error }
    }

    if (!data) {
      return { error: 'No data returned from internal save' }
    }

    if (Array.isArray(data)) {
      throw new Error('Internal save returned an array, this should not happen')
    }
    let parentData = data
    let errors: (Error | string)[] | undefined

    // insert relations - todo upsert / overwrite (param)
    for (let [relationName, relation] of Object.entries(_relations)) {
      // todo - implement cardinality, might need to create link record
      for (let item of relation) {
        let relationEntries = new Relation<T>()
        // todo - cardinality, not required if many to many
        item[`${parentData.typeName}_id`] = parentData.id
        let { data, error } = await this.save(item)
        if (error) {
          if (!errors) {
            errors = []
          }
          errors.push(error)
        } else {
          relationEntries.push(data as T)
        }
        parentData[relationName] = relationEntries
      }
    }

    if (errors) {
      return { error: new Error(errors.map((e) => (e instanceof Error ? e.message : e)).join('\n')) }
    }

    return this.unpack(data)
  }

  override update<T extends Storable>(item: T): Promise<StorageResult<T>> {
    return this.implementation.update(item)
  }

  override delete<T extends Storable>(item: T): Promise<StorageResult<T>> {
    return this.implementation.delete(item)
  }

  override async load<T extends Storable>(type: T | string, id?: string | number): Promise<StorageResult<T>> {
    let result = await this.implementation.load(type, id)
    if ('error' in result) {
      return result
    }

    let relations: Record<string, Relation<Storable>> = {}
    let typeSample = typeof type === 'string' ? getRegisteredStorables().get(type) : type
    // identify relations that need to be loaded
    for (let key in typeSample) {
      if (key === 'typeName') {
        continue
      }
      if ((typeSample[key] as any) instanceof Relation) {
        relations[key] = typeSample[key]
      }
    }

    for (let item of (Array.isArray(result.data) ? result.data : [result.data]) as Storable[]) {
      item['_relations'] = relations
    }

    let unpacked = await this.unpack<any>(result.data)
    if ('error' in unpacked) {
      return unpacked
    }

    return { data: unpacked.data as T }
  }
}
