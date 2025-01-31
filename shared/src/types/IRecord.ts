export interface IRecord {
  typeName: string
  id: string | number
  createdAt: number
  updatedAt: number
}

export const isIRecord = (item: any): item is IRecord => {
  return (
    item && typeof item === 'object' && 'typeName' in item && 'id' in item && 'createdAt' in item && 'updatedAt' in item
  )
}

export const isIRecordArray = (items: any): items is IRecord[] => {
  return Array.isArray(items) && items.every(isIRecord)
}
