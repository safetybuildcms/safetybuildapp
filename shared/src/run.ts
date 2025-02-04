import { db_test } from './actions/database'
import dotenv from 'dotenv'
import { fs_storage_test } from './actions/storage'
dotenv.config({ path: '../SafetyBuildApp/.env' })

let actions = new Map<string, () => void>()
actions.set('db-test', db_test)
actions.set('fs-storage-test', fs_storage_test)

let action = actions.get(process.argv[2])
if (action) {
  action()
} else {
  console.log('Unknown action', process.argv[2])
}
