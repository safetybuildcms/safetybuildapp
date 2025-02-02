import { IRecord } from '../types/IRecord'
import { registerStorable } from '../services/storage/storable'

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

export interface Document extends IRecord {
  name: string
  url: string
  policyNumber: string
  expiryDate: number
  status: DocumentStatus
  type: DocumentType
}

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
  type: DocumentType.PUBLIC_LIABILITY
}

registerStorable(DocumentTypeSample)
