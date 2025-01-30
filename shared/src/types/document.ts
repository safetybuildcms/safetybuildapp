import { Record } from './record'

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

export interface Document extends Record {
  name: string
  url: string
  policyNumber: string
  expiryDate: number
  status: DocumentStatus
  type: DocumentType
}
