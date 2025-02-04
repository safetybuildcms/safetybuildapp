export interface IRecord {
  typeName: string
  id: string
  createdAt: number
  updatedAt: number
}

export type omitFromIRecord = 'id' | 'createdAt' | 'updatedAt'

export type InsertIRecord<T> = Omit<T, omitFromIRecord>

export interface IUserRecord {
  uid: string
}

export type omnitFromIUserRecord = omitFromIRecord | 'uid'

export type InsertIUserRecord<T> = Omit<T, omnitFromIUserRecord>

export const isIRecord = (item: any): item is IRecord => {
  return (
    item && typeof item === 'object' && 'typeName' in item && 'id' in item && 'createdAt' in item && 'updatedAt' in item
  )
}

export const isIRecordArray = (items: any): items is IRecord[] => {
  return Array.isArray(items) && items.every(isIRecord)
}
