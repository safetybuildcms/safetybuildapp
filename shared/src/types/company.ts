import { Record } from './record'
import { Contractor } from './contractor'

export interface Company extends Record {
  businessPhone: string
  businessEmail: string
  name: string
  contractors: Contractor[]
}
