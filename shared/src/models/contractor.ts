import { Relation } from '../types/relation'
import { registerStorable, Storable } from '../services/storage/storable'
import { IRecord, IUserRecord } from '../types/IRecord'
import { Document, InsertDocument } from './document'

export const CONTRACTOR_TYPE_NAME = 'Contractor'

export interface Contractor extends IRecord, IUserRecord {
  typeName: typeof CONTRACTOR_TYPE_NAME
  name: string
  email: string
  phone: string
  documents: Relation<Document | InsertDocument>
}

export type InsertContractor = Partial<Contractor> & Storable

export const ContractorTypeSample: Contractor = {
  typeName: CONTRACTOR_TYPE_NAME,
  id: 'contractor',
  createdAt: 0,
  updatedAt: 0,
  uid: '',
  name: 'Contractor',
  email: 'contractor@example.com',
  phone: '+1 1234567890',
  documents: new Relation<Document | InsertDocument>()
}

registerStorable(ContractorTypeSample)
