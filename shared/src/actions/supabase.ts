import { ContractorTypeSample } from '../models/contractor'
import { StorageService } from '../services/storage/service'
import { SupabaseStorageService } from '../services/storage/supabase'
import { getSupabaseClient, getSupabaseEnv } from '../services/supabase'

import { initializeSupabase } from '../services/supabase'

export const setupBackend = async (args: string[]) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv()

  initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)
  let adminClient = getSupabaseClient(SUPABASE_SERVICE_ROLE_KEY)
  let storage = new SupabaseStorageService(() => crypto.randomUUID(), adminClient, args[0])
  storage.adminClient = adminClient
  await storage.initialize()
  console.log('Storage setup complete.')
}

export const supabase_storage_test = async () => {
  let { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv()
  initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)
  let adminClient = getSupabaseClient(SUPABASE_SERVICE_ROLE_KEY)
  let storage = new SupabaseStorageService(() => crypto.randomUUID(), adminClient, 'test')
  storage.adminClient = adminClient
  await storage.initialize()
  let storageService = new StorageService(storage)
  let contractor = ContractorTypeSample
  contractor.id = storageService.generateId()
  let saveResult = await storageService.save(contractor)
  if (saveResult.error) {
    console.error('Error saving contractor:', saveResult.error)
  }
  let { data: contractorIn, error } = await storageService.load(contractor, contractor.id)
  if (error) {
    console.error('Error loading contractor:', error)
  }
  console.log('supabase storage test complete.')
}
