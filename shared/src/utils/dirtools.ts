import { mkdtemp } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
let tempPaths: string[] = []

/**
 * **NodeJS Only** Create a temporary directory and return the path.
 * @param prefix - The prefix for the temporary directory.
 * @returns The path to the temporary directory.
 */
export const mktemp = async (prefix: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    mkdtemp(path.join(tmpdir(), prefix), (err, dir) => {
      if (err) reject(err)
      else {
        tempPaths.push(dir)
        resolve(dir)
      }
    })
  })
}

/**
 * **NodeJS Only** Cleanup all temporary directories created by
 */
export const rmtemp = () => {
  for (let dir of tempPaths) {
    fs.rmSync(dir, { recursive: true })
  }
}

/**
 * ** NodeJS Only ** Get the home directory for the current user.
 * @returns The home directory for the current user.
 */
export const homePath = () => {
  return process.env.HOME ?? process.env.USERPROFILE ?? ''
}
