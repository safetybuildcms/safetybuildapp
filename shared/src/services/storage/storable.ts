const registeredStorables = new Map<string, Storable>()

export interface Storable {
  id: string | number
  typeName: string
}

/**
 * Register a storable type with a sample instance
 * @param typeSample provide a sample instance of the type, since Typescript types are not available at runtime
 */
export const registerStorable = (typeSample: Storable) => {
  registeredStorables.set(typeSample.typeName, typeSample)
}

/**
 * Used by storage provider to initialize storage
 * @returns string[]
 */
export const getRegisteredStorables = () => {
  return registeredStorables
}
