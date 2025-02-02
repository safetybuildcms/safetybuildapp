import dotenv from 'dotenv'
import { SupabaseStorageService } from './supabase'
import { Contractor, ContractorTypeSample } from '../../models/contractor'
import { StorageService } from './service'
import { getSupabaseClient, getSupabaseEnv, initializeSupabase } from '../supabase'

dotenv.config({ path: '../SafetyBuildApp/.env' })

let devPrefixes = Array<string>()
const getDevPrefix = () => {
  let prefix = crypto.randomUUID().slice(0, 8)
  devPrefixes.push(prefix)
  return prefix
}

const getAdminClient = () => {
  let { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv()
  initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)
  let supabaseClient = getSupabaseClient(SUPABASE_SERVICE_ROLE_KEY)
  return supabaseClient
}

afterAll(async () => {
  let supabaseClient = getAdminClient()
  for (let prefix of devPrefixes) {
    let buckets = (await supabaseClient.storage.listBuckets()).data ?? []
    for (let bucket of buckets) {
      if (bucket.name.startsWith(prefix)) {
        console.log('Removing bucket:', bucket.name)
        await supabaseClient.storage.deleteBucket(bucket.name)
      }
    }
  }
})

describe('SupabaseStorageService', () => {
  it('should be able to save and load a contractor', async () => {
    // todo - refactor, this is a duplicate of the supabase_storage_test action
    let supabaseClient = getAdminClient()

    let devPrefix = getDevPrefix()
    let storageImplementation = new SupabaseStorageService(() => crypto.randomUUID(), supabaseClient, devPrefix)
    storageImplementation.adminClient = supabaseClient
    await storageImplementation.initialize()

    let storage = new StorageService(storageImplementation)
    let contractor = ContractorTypeSample
    contractor.id = storage.generateId()
    let saveResult = await storage.save(contractor)
    if (saveResult.error) {
      console.error('Error saving contractor:', saveResult.error)
    }
    let { data: contractorIn, error } = await storage.load(contractor, contractor.id)
    if (error) {
      console.error('Error loading contractor:', error)
    }
    expect(error).toBeUndefined()
    expect(contractorIn).toMatchObject(contractor)
  })
})
