import { IRecord } from '../types/IRecord'
import { Contractor } from './contractor'
import { registerStorable } from '../services/storage/storable'

export const COMPANY_TYPE_NAME = 'Company'

export interface Company extends IRecord {
  businessPhone: string
  businessEmail: string
  name: string
  contractors: Contractor[]
}

export const CompanyTypeSample: Company = {
  typeName: COMPANY_TYPE_NAME,
  id: 'company',
  createdAt: 0,
  updatedAt: 0,
  name: 'Company',
  businessPhone: '+1 1234567890',
  businessEmail: 'company@example.com',
  contractors: []
}

registerStorable(CompanyTypeSample)
