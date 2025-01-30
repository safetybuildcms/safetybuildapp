import { NodeFsStorageService } from '../services/storage/nodefs'
import { mktemp, rmtemp, homePath } from '../utils/dirtools'

import { Contractor, Company, Document, DocumentStatus, DocumentType } from '../models'

export const fs_storage_test = async () => {
  // let storagePath = await mktemp('nodefs-storage')
  let storagePath = homePath() + '/nodefs-storage'
  let storage = new NodeFsStorageService(storagePath)
  console.log('storage root', storage.storageRoot)
  storage.initialize()
  console.log('fs_storage_test()')

  let contractor: Contractor = {
    typeName: 'Contractor',
    id: 'contractor',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'Contractor',
    email: 'contractor@example.com',
    phone: '+1 1234567890',
    documents: []
  }

  let document: Document = {
    typeName: 'Document',
    id: 'document',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    name: 'Document',
    url: 'https://example.com/document.pdf',
    policyNumber: '1234567890',
    expiryDate: Date.now(),
    status: DocumentStatus.ACTIVE,
    type: DocumentType.PUBLIC_LIABILITY
  }
  // rmtemp()

  contractor.documents.push(document)

  storage.save(contractor)
  storage.save(document)
}
