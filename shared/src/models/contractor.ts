export const CONTRACTOR_TYPE_NAME = 'Contractor'

import { registerStorable } from '../services/storage/storable'
import { IRecord } from '../types/IRecord'
import { Document } from './document'
export interface Contractor extends IRecord {
  name: string
  email: string
  phone: string
  documents: Document[]
}

export const ContractorTypeSample: Contractor = {
  typeName: CONTRACTOR_TYPE_NAME,
  id: 'contractor',
  createdAt: 0,
  updatedAt: 0,
  name: 'Contractor',
  email: 'contractor@example.com',
  phone: '+1 1234567890',
  documents: []
}

registerStorable(ContractorTypeSample)
