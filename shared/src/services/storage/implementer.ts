import { StorageResult } from './results'

import { Storable } from './storable'

export abstract class StorageServiceImplementer {
  // todo - id field init
  /**
   * Generates an 8 character random string, use system specific uuid if possible
   */
  abstract generateId(): string
  abstract initialize(): Promise<void>
  abstract save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>>
  abstract update<T extends Storable>(item: T): Promise<StorageResult<T>>
  abstract delete<T extends Storable>(item: T): Promise<StorageResult<T>>
  abstract load<T extends Storable>(type: T | string, id?: string | number): Promise<StorageResult<T>>
  abstract load<T extends Storable>(type: T | string): Promise<StorageResult<T>>
  typeNameOf<T extends Storable>(type: T | string): string {
    return typeof type === 'string' ? type : type.typeName
  }
  idOf<T extends Storable>(item: T | string, id?: string | number): string | number {
    if (typeof item === 'string' && id === undefined) {
      throw new Error('Item must be an object with an id when id is not provided')
    }
    return typeof item === 'string' ? (id ?? item) : item.id
  }
}
