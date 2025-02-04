import { IRecord, IUserRecord } from '../types/IRecord'
import { registerStorable, Storable } from '../services/storage/storable'

export const DOCUMENT_TYPE_NAME = 'Document'

export enum DocumentType {
  PUBLIC_LIABILITY = 'Public Liability',
  WORKERS_COMPENSATION = 'Workers Compensation',
  CONTRACTOR_INSURANCE = 'Contractor Insurance',
  PERSONAL_INDEMNITY = 'Personal Indemnity'
}

export enum DocumentStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  RENEWED = 'Renewed',
  REVIEW = 'Review',
  REJECTED = 'Rejected'
}

export interface Document extends IRecord, IUserRecord {
  typeName: typeof DOCUMENT_TYPE_NAME
  name: string
  url: string
  policyNumber: string
  expiryDate: number
  status: DocumentStatus
  type: DocumentType
}

export type InsertDocument = Partial<Document> & Storable

export const DocumentTypeSample: Document = {
  typeName: DOCUMENT_TYPE_NAME,
  id: 'document',
  createdAt: 0,
  updatedAt: 0,
  name: 'Document',
  url: 'https://example.com',
  policyNumber: '1234567890',
  expiryDate: 0,
  status: DocumentStatus.ACTIVE,
  type: DocumentType.PUBLIC_LIABILITY,
  uid: 'document'
}

registerStorable(DocumentTypeSample)
