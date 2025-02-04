import { registerStorable, Storable } from '../services/storage/storable'
import { IUserRecord } from '../types/IRecord'
import { IRecord } from '../types/IRecord'

export const EMPLOYEE_TYPE_NAME = 'Employee'

export interface Employee extends IRecord, IUserRecord {
  typeName: typeof EMPLOYEE_TYPE_NAME
  companyId: string
  name: string
  email: string
  phone: string
}

export type InsertEmployee = Partial<Employee> & Storable

export const EmployeeTypeSample: Employee = {
  typeName: EMPLOYEE_TYPE_NAME,
  id: 'employee',
  createdAt: 0,
  updatedAt: 0,
  uid: '',
  companyId: '',
  name: 'Employee',
  email: 'employee@example.com',
  phone: '+1 1234567890'
}

registerStorable(EmployeeTypeSample)
