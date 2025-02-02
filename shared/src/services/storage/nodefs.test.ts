import { mktemp, rmtemp } from '../../utils/dirtools'
import { NodeFsStorageService } from './nodefs'
import { Contractor, ContractorTypeSample } from '../../models/contractor'
import { StorageService } from './service'

afterAll(() => {
  rmtemp()
})

describe('NodeFSStorageService', () => {
  it('should be able to save and load a contractor', async () => {
    let storageImplementation = new NodeFsStorageService(await mktemp('nodefs-storage-'))
    let storage = new StorageService(storageImplementation)
    await storage.initialize()
    let contractor = ContractorTypeSample
    contractor.id = storage.generateId()
    await storage.save(contractor)
    let { data: contractorIn, error } = await storage.load(contractor, contractor.id)
    expect(error).toBeUndefined()
    expect(contractorIn).toMatchObject(contractor)
  })
})
