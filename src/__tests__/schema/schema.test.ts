import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Schema } from '../../schema/schema.js'
import * as requestModule from '../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { ObjectData } from '../../types/objectData.js'

vi.mock('../../request/request.js')

describe('Schema', () => {
  const credentials: Credentials = {
    appId: 'test-app',
    apiKey: 'test-key'
  }

  const clientConfig: ClientConfig = {
    url: 'https://www.appsheet.com',
    locale: 'en-GB',
    timezone: 'UTC'
  }

  const config: Config = {
    timezone: 'UTC',
    returnRawData: false,
    sendRawData: false
  }

  const userSchema: ObjectData = {
    id: {
      type: 'string',
      primary: true
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    age: {
      type: 'integer'
    }
  }

  let schema: Schema<{
    id: string
    name: string
    email: string
    age: number
  }>

  beforeEach(() => {
    vi.clearAllMocks()
    schema = new Schema(credentials, config, clientConfig, 'Users', userSchema)
  })

  describe('constructor', () => {
    it('should create a schema instance', () => {
      expect(schema).toBeInstanceOf(Schema)
    })
  })

  describe('findById', () => {
    it('should throw error when ID is empty', async () => {
      await expect(schema.findById('')).rejects.toThrow('ID is required to find an item by ID.')
    })

    it('should find record by ID', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          age: '30'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const result = await schema.findById('123')

      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      })
    })
  })

  describe('find', () => {
    it('should find all records', async () => {
      const mockResponse = [
        { id: '1', name: 'User 1', email: 'user1@test.com', age: '25' },
        { id: '2', name: 'User 2', email: 'user2@test.com', age: '30' }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const result = await schema.find()

      expect(result).toHaveLength(2)
      expect(result[0].age).toBe(25)
    })

    it('should find records with properties', async () => {
      const mockResponse = [{ id: '1', name: 'Adult', email: 'adult@test.com', age: '25' }]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const result = await schema.find({ Selector: 'Filter(Users, [age] >= 21)' })

      expect(result).toHaveLength(1)
    })

    it('should find specific rows', async () => {
      const mockResponse = [{ id: '123', name: 'Specific', email: 'test@test.com', age: '30' }]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const result = await schema.find({}, [{ id: '123' }])

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('123')
    })
  })

  describe('create', () => {
    it('should create a record', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'New User',
          email: 'new@test.com',
          age: '25'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const data = {
        name: 'New User',
        email: 'new@test.com',
        age: 25
      }

      const result = await schema.create(data)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Add',
        {},
        expect.any(Object)
      )

      expect(result).toEqual({
        id: '123',
        name: 'New User',
        email: 'new@test.com',
        age: 25
      })
    })

    it('should create record with custom properties', async () => {
      const mockResponse = [{ id: '123', name: 'Test', email: 'test@test.com', age: '30' }]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      await schema.create({ name: 'Test' }, { UserEmail: 'admin@test.com' })

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Add',
        { UserEmail: 'admin@test.com' },
        expect.any(Object)
      )
    })
  })

  describe('createMany', () => {
    it('should create multiple records', async () => {
      const mockResponse = [
        { id: '1', name: 'User 1', email: 'user1@test.com', age: '25' },
        { id: '2', name: 'User 2', email: 'user2@test.com', age: '30' }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const dataArray = [
        { name: 'User 1', email: 'user1@test.com', age: 25 },
        { name: 'User 2', email: 'user2@test.com', age: 30 }
      ]

      const result = await schema.createMany(dataArray)

      expect(result).toHaveLength(2)
      expect(result[0].age).toBe(25)
      expect(result[1].age).toBe(30)
    })
  })

  describe('update', () => {
    it('should update a record', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'Updated User',
          email: 'updated@test.com',
          age: '31'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const data = {
        id: '123',
        name: 'Updated User',
        age: 31
      }

      const result = await schema.update(data)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Edit',
        {},
        expect.any(Object)
      )

      expect(result).toEqual({
        id: '123',
        name: 'Updated User',
        email: 'updated@test.com',
        age: 31
      })
    })

    it('should update record with custom properties', async () => {
      const mockResponse = [{ id: '123', name: 'Test', email: 'test@test.com', age: '30' }]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      await schema.update({ id: '123', name: 'Test' }, { UserEmail: 'admin@test.com' })

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Edit',
        { UserEmail: 'admin@test.com' },
        expect.any(Object)
      )
    })
  })

  describe('updateMany', () => {
    it('should update multiple records', async () => {
      const mockResponse = [
        { id: '1', name: 'Updated 1', email: 'user1@test.com', age: '26' },
        { id: '2', name: 'Updated 2', email: 'user2@test.com', age: '31' }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const dataArray = [
        { id: '1', age: 26 },
        { id: '2', age: 31 }
      ]

      const result = await schema.updateMany(dataArray)

      expect(result).toHaveLength(2)
      expect(result[0].age).toBe(26)
      expect(result[1].age).toBe(31)
    })
  })

  describe('delete', () => {
    it('should delete a record', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'Deleted User',
          email: 'deleted@test.com',
          age: '30'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const data = { id: '123' }

      const result = await schema.delete(data)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Delete',
        {},
        expect.any(Object)
      )

      expect(result).toEqual({
        id: '123',
        name: 'Deleted User',
        email: 'deleted@test.com',
        age: 30
      })
    })

    it('should delete record with custom properties', async () => {
      const mockResponse = [{ id: '123', name: 'Test', email: 'test@test.com', age: '30' }]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      await schema.delete({ id: '123' }, { UserEmail: 'admin@test.com' })

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Delete',
        { UserEmail: 'admin@test.com' },
        expect.any(Object)
      )
    })
  })

  describe('deleteMany', () => {
    it('should delete multiple records', async () => {
      const mockResponse = [
        { id: '1', name: 'Deleted 1', email: 'user1@test.com', age: '25' },
        { id: '2', name: 'Deleted 2', email: 'user2@test.com', age: '30' }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const dataArray = [{ id: '1' }, { id: '2' }]

      const result = await schema.deleteMany(dataArray)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('2')
    })
  })

  describe('error handling', () => {
    it('should handle API errors in create', async () => {
      vi.mocked(requestModule.makeRequest).mockRejectedValue(new Error('API Error'))

      await expect(schema.create({ name: 'Test' })).rejects.toThrow('API Error')
    })

    it('should handle API errors in find', async () => {
      vi.mocked(requestModule.makeRequest).mockRejectedValue(new Error('API Error'))

      await expect(schema.find()).rejects.toThrow('API Error')
    })

    it('should handle API errors in update', async () => {
      vi.mocked(requestModule.makeRequest).mockRejectedValue(new Error('API Error'))

      await expect(schema.update({ id: '123', name: 'Test' })).rejects.toThrow('API Error')
    })

    it('should handle API errors in delete', async () => {
      vi.mocked(requestModule.makeRequest).mockRejectedValue(new Error('API Error'))

      await expect(schema.delete({ id: '123' })).rejects.toThrow('API Error')
    })
  })
})
