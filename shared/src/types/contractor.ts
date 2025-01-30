import { Record } from './record'

export interface Contractor extends Record {
  name: string
  email: string
  phone: string
  documents: Document[]
}
