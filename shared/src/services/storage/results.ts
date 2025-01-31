import { Storable } from './storable'

export type StorageResultList<T extends Storable> = {
  data: T[]
  error?: string | Error
}

export type StorageResultItem<T extends Storable> = {
  data: T
  error?: string | Error
}

export type StorageResultError = {
  data?: undefined
  error: string | Error
}

export type StorageResult<T extends Storable> = StorageResultList<T> | StorageResultItem<T> | StorageResultError

export const storageError = (e: any): StorageResultError => {
  return { error: e instanceof Error ? e : (e?.toString() ?? 'Unknown Error'), data: undefined }
}
