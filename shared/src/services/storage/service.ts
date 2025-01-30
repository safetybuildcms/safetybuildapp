import { Storable } from './storable'

export type StorageResultList<T extends Storable> = {
  data: T[]
}

export type StorageResultItem<T extends Storable> = {
  data: T
}

export type StorageResultError = {
  data: undefined
  error: string | Error
}

export type StorageResult<T extends Storable> = StorageResultList<T> | StorageResultItem<T> | StorageResultError

export const storageError = (e: any): StorageResultError => {
  return { error: e instanceof Error ? e : (e?.toString() ?? 'Unknown Error'), data: undefined }
}

export abstract class StorageService {
  // todo - id field init
  // todo - make functions below non-abstract, call descedant functions for implementation specific logic
  // todo - internal serialisation/deserialisation
  abstract initialize(): Promise<void>
  abstract save<T extends Storable>(item: T, overwrite?: boolean): Promise<StorageResult<T>>
  abstract update<T extends Storable>(item: T): Promise<StorageResult<T>>
  abstract delete<T extends Storable>(item: T): Promise<StorageResult<T>>
  abstract load<T extends Storable>(type: T, id: string | number): Promise<StorageResult<T>>
  abstract load<T extends Storable>(type: T): Promise<StorageResult<T>>
}
