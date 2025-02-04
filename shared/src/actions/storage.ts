import { NodeFsStorageService } from '../services/storage/nodefs'
import { StorageService } from '../services/storage/service'
import { mktemp, rmtemp, homePath } from '../utils/dirtools'

import { Contractor, Company, Document, DocumentStatus, DocumentType } from '../models'

export const fs_storage_test = async () => {
  // let storagePath = await mktemp('nodefs-storage')
  let storagePath = homePath() + '/nodefs-storage'
  let storageImplementation = new NodeFsStorageService(storagePath)
  let storage = new StorageService(storageImplementation)
  console.log('storage root', storageImplementation.storageRoot)
  storage.initialize()
  console.log('fs_storage_test()')

  let contractor: Contractor = {
    typeName: 'Contractor',
    uid: 'contractor',
    id: storage.generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'Contractor',
    email: 'contractor@example.com',
    phone: '+1 1234567890',
    documents: []
  }

  let document: Document = {
    typeName: 'Document',
    id: storage.generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    uid: 'contractor',
    name: 'Document',
    url: 'https://example.com/document.pdf',
    policyNumber: '1234567890',
    expiryDate: Date.now(),
    status: DocumentStatus.ACTIVE,
    type: DocumentType.PUBLIC_LIABILITY
  }
  // rmtemp()

  contractor.documents.push(document)

  // this isn't pretty, might need a util function to throw errors in main client files
  let error0 = (await storage.save(contractor)).error
  let error1 = (await storage.save(document)).error

  if (error0) {
    console.error(`Failed to save contractor: ${error0}`)
  }
  if (error1) {
    console.error(`Failed to save document: ${error1}`)
  }

  console.log(`contractor out:`, JSON.stringify(contractor, null, 2))

  let { data: contractorIn, error } = await storage.load(contractor, contractor.id)
  if (error) {
    console.error(`Failed to load contractor: ${error}`)
  }

  console.log(`contractor in:`, JSON.stringify(contractorIn, null, 2))
}
