import { signup_test } from './actions/auth-test'
import dotenv from 'dotenv'
import { fs_storage_test } from './actions/storage'
import { supabase_database_test } from './actions/database-test'
import { all_in_one_test } from './actions/aio'
dotenv.config({ path: '../SafetyBuildApp/.env' })

let actions = new Map<string, () => void>()
actions.set('signup-test', signup_test)
actions.set('fs-storage-test', fs_storage_test)
actions.set('supabase-database-test', supabase_database_test)

let action = actions.get(process.argv[2])
if (action) {
  action()
} else {
  console.log('Unknown action', process.argv[2])
}
