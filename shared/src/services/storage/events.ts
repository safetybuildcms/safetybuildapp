import { Storable } from './storable'

export type StorageEventType = 'save' | 'load' | 'delete'

export type SimpleStorageEventFilter = {
  eventName?: StorageEventType
  type?: Storable
  id?: string | number
}

export type StorageEvent<T extends Storable> = {
  eventType: StorageEventType
  item: T
}

export type StorageListener<T extends Storable> = {
  /**
   * Set by `addStorageListner`
   */
  id?: number
  eventType: StorageEventType
  filter?: SimpleStorageEventFilter
  filterFunction?: (eventType: StorageEventType, item: T) => boolean
  handler: (event: StorageEvent<T>) => Promise<any>
}

let storageListenerCount = 0
let storageListeners = new Map<number, StorageListener<any>>()

export const addStorageListener = <T extends Storable>(listener: StorageListener<T>) => {
  if (listener.id !== undefined) {
    throw new Error('Listener already has an id. Did you call addStorageListener twice?')
  }
  listener.id = storageListenerCount++
  storageListeners.set(listener.id, listener)
}

export const removeStorageListener = <T extends Storable>(listener: StorageListener<T>) => {
  if (listener.id === undefined) {
    throw new Error('Listener does not have an id. Did you call removeStorageListener before addStorageListener?')
  }
  storageListeners.delete(listener.id)
  listener.id = undefined
}

const filterStorageListeners = <T extends Storable>(
  item: T,
  eventName: StorageEventType,
  listeners: Map<number, StorageListener<any>>
) => {
  return [...listeners.values()].filter((listener: StorageListener<T>) => {
    if (listener.filterFunction?.(eventName, item)) {
      return true
    } else if (listener.filter) {
      if (
        (listener.filter.type === undefined || listener.filter.type.typeName === item.typeName) &&
        (listener.filter.id === undefined || listener.filter.id === item.id) &&
        (listener.filter.eventName === undefined || listener.filter.eventName === eventName)
      ) {
        return true
      }
    }

    return false
  })
}

export const onStorageEvent = async <T extends Storable>(item: T, eventType: StorageEventType) => {
  for (let listener of filterStorageListeners(item, eventType, storageListeners)) {
    await listener.handler({ item, eventType })
  }
}
