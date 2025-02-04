const registeredStorables = new Map<string, Storable>()
const registeredStorablesLC = new Map<string, Storable>()

export type Storable = {
  [key: string]: any
  // id: string | number
  typeName: string
}

/**
 * Register a storable type with a sample instance
 * @param typeSample provide a sample instance of the type, since Typescript types are not available at runtime
 */
export const registerStorable = (typeSample: Storable) => {
  registeredStorables.set(typeSample.typeName, typeSample)
  registeredStorablesLC.set(typeSample.typeName.toLowerCase(), typeSample)
}

/**
 * Used by storage provider to initialize storage
 * @returns string[]
 */
export const getRegisteredStorables = (lowerCase: boolean = false) => {
  return lowerCase ? registeredStorablesLC : registeredStorables
}

const pluralSuffixes = ['ies', 'es', 's']

/**
 * Determines sinular type name by removing 's', 'ies' and 'es' suffixes and checking for name in registered storables
 * @param memberName - the name of the member to get the singular type name of
 * @returns
 */
export const registeredSingularOf = (memberName: string) => {
  let storables = getRegisteredStorables(true)
  if (storables.has(memberName)) {
    return memberName
  }

  for (let suffix of pluralSuffixes) {
    if (memberName.endsWith(suffix)) {
      let singular = memberName.slice(0, -suffix.length)
      if (storables.has(singular)) {
        return singular
      }
    }
  }

  throw new Error(`No singular type name found for ${memberName}`)
}
