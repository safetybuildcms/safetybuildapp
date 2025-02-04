import { deleteUserByEmail, getSupabaseClient, getSupabaseEnv, getUserClient } from '../services/supabase'
import { initializeSupabase } from '../services/supabase'
import { SupabaseDatabaseService } from '../services/storage/db/supabase-service'
import { CONTRACTOR_TYPE_NAME, Contractor, InsertContractor } from '../models/contractor'
import { SupabaseDatabaseServiceImplementer } from '../services/storage/db/supabase-service-implementer'
import { createTestUser } from './auth-test'
import { randomUUID } from 'crypto'
import { getAuthService } from '../services/auth'
import { User, Session } from '@supabase/supabase-js'
import { Relation } from '../types/relation'
import { DocumentType, Document, DOCUMENT_TYPE_NAME, DocumentStatus, InsertDocument } from '../models/document'
export const supabase_database_test = async () => {
  let { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = getSupabaseEnv()
  initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)
  let adminClient = getSupabaseClient(SUPABASE_SERVICE_ROLE_KEY)
  let testEmail = `rando_${randomUUID().slice(0, 8)}@contractors.com`
  let user: User | null = null
  let session: Session | null = null

  try {
    let createResult = await createTestUser(testEmail)
    user = createResult.user
    session = createResult.session
  } catch (e) {
    console.error('Error in supabase storage test:', e)
  }

  if (!user) {
    let retry = await getAuthService().signIn(testEmail, randomUUID())
    user = retry.user
    session = retry.session
  }
  console.log('session token', session?.access_token)
  let userClient = await getUserClient(SUPABASE_URL, SUPABASE_ANON_KEY, session?.access_token ?? '')
  try {
    let storage = new SupabaseDatabaseServiceImplementer(userClient)
    await storage.initialize()
    let storageService = new SupabaseDatabaseService(storage)
    let contractor: InsertContractor | Contractor = {
      name: 'AAA Contractor',
      email: user.email!,
      phone: '+1 1234567890',
      documents: new Relation<InsertDocument | Document>([
        {
          name: 'Document 1',
          type: DocumentType.PUBLIC_LIABILITY,
          typeName: DOCUMENT_TYPE_NAME,
          url: 'https://example.com/document1.pdf',
          policyNumber: '1234567890',
          expiryDate: new Date().getTime(),
          status: DocumentStatus.ACTIVE
        }
      ]),
      typeName: CONTRACTOR_TYPE_NAME
    }
    let saveResult = await storageService.save(contractor)
    // let saveResult = await userClient.from('contractor').insert(contractor).select('*')
    if (saveResult?.error) {
      console.error('Error saving contractor:', saveResult.error)
      return
    }
    console.log('saveResult', saveResult.data)

    if (!saveResult.data || saveResult.data.length === 0) {
      console.error('No data returned from save')
      return
    }

    // return
    contractor = Array.isArray(saveResult.data) ? saveResult.data[0] : saveResult.data

    let { data: contractorIn, error } = await storageService.load(CONTRACTOR_TYPE_NAME, contractor.id)
    if (error) {
      console.error('Error loading contractor:', error)
    }
    console.log('supabase storage test complete.', contractorIn)
  } catch (e) {
    console.error('Error in supabase storage test:', e)
  } finally {
    await deleteUserByEmail(adminClient, testEmail)
  }
}
