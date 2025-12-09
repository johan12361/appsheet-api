import { describe, it, expect, vi, beforeEach } from 'vitest'
import { create } from '../../../schema/methods/create.js'
import { find } from '../../../schema/methods/find.js'
import { findById } from '../../../schema/methods/findById.js'
import * as requestModule from '../../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../../types/client.js'
import type { ObjectData } from '../../../types/objectData.js'

vi.mock('../../../request/request.js')

interface User {
  id: string
  name: string
  email: string
  age: number
  isActive: boolean
}

describe('Schema Methods', () => {
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
    },
    isActive: {
      type: 'boolean'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new record', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          age: '30',
          isActive: 'true'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }

      const result = await create(credentials, clientConfig, 'Users', config, userSchema, data)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Add',
        {},
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com'
        })
      )

      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      })
    })

    it('should handle sendRawData config', async () => {
      const mockResponse = [{ id: '123', name: 'Test' }]
      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const rawConfig: Config = { ...config, sendRawData: true }
      const data = { id: '123', name: 'Test' }

      await create(credentials, clientConfig, 'Users', rawConfig, userSchema, data)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(credentials, clientConfig, 'Users', 'Add', {}, data)
    })

    it('should handle returnRawData config', async () => {
      const mockResponse = [{ id: '123', name: 'Test', age: '30' }]
      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const rawConfig: Config = { ...config, returnRawData: true }
      const data = { name: 'Test', age: 30 }

      const result = await create(credentials, clientConfig, 'Users', rawConfig, userSchema, data)

      expect(result).toEqual({ id: '123', name: 'Test', age: '30' })
    })

    it('should pass custom properties', async () => {
      const mockResponse = [{ id: '123', name: 'Test' }]
      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const properties = { UserEmail: 'admin@example.com' }
      const data = { name: 'Test' }

      await create(credentials, clientConfig, 'Users', config, userSchema, data, properties)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Add',
        properties,
        expect.any(Object)
      )
    })
  })

  describe('find', () => {
    it('should find multiple records', async () => {
      const mockResponse = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          age: '25',
          isActive: 'true'
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          age: '30',
          isActive: 'false'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const result = await find<User>(credentials, clientConfig, 'Users', config, userSchema)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(credentials, clientConfig, 'Users', 'Find', {}, [])

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
        age: 25,
        isActive: true
      })
    })

    it('should find records with selector', async () => {
      const mockResponse = [
        {
          id: '1',
          name: 'Adult User',
          age: '25',
          email: 'adult@example.com',
          isActive: 'true'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const properties = { Selector: 'Filter(Users, [age] >= 21)' }

      const result = await find<User>(credentials, clientConfig, 'Users', config, userSchema, properties)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(credentials, clientConfig, 'Users', 'Find', properties, [])

      expect(result).toHaveLength(1)
      expect(result[0].age).toBe(25)
    })

    it('should find specific rows by key', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'Specific User',
          email: 'user@example.com',
          age: '30',
          isActive: 'true'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const rows = [{ id: '123' }]

      const result = await find<User>(credentials, clientConfig, 'Users', config, userSchema, {}, rows)

      expect(requestModule.makeRequest).toHaveBeenCalledWith(credentials, clientConfig, 'Users', 'Find', {}, rows)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('123')
    })

    it('should handle returnRawData config', async () => {
      const mockResponse = [{ id: '1', name: 'Test', age: '25' }]
      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const rawConfig: Config = { ...config, returnRawData: true }

      const result = await find(credentials, clientConfig, 'Users', rawConfig, userSchema)

      expect(result).toEqual(mockResponse)
    })

    it('should return empty array when no records found', async () => {
      vi.mocked(requestModule.makeRequest).mockResolvedValue([])

      const result = await find(credentials, clientConfig, 'Users', config, userSchema)

      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should find record by ID', async () => {
      const mockResponse = [
        {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          age: '30',
          isActive: 'true'
        }
      ]

      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const result = await findById(credentials, clientConfig, 'Users', config, userSchema, '123')

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Find',
        {},
        { id: '123' }
      )

      expect(result).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      })
    })

    it('should return undefined when record not found', async () => {
      vi.mocked(requestModule.makeRequest).mockResolvedValue([])

      const result = await findById(credentials, clientConfig, 'Users', config, userSchema, '999')

      expect(result).toBeUndefined()
    })

    it('should throw error when no primary key in schema', async () => {
      const schemaWithoutPrimary: ObjectData = {
        name: { type: 'string' },
        email: { type: 'string' }
      }

      await expect(findById(credentials, clientConfig, 'Users', config, schemaWithoutPrimary, '123')).rejects.toThrow(
        'No ID key defined in data schema.'
      )
    })

    it('should use custom key from schema', async () => {
      const customKeySchema: ObjectData = {
        userId: {
          type: 'string',
          primary: true,
          key: 'User_ID'
        },
        name: { type: 'string' }
      }

      const mockResponse = [{ User_ID: '123', name: 'Test User' }]
      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      await findById(credentials, clientConfig, 'Users', config, customKeySchema, '123')

      expect(requestModule.makeRequest).toHaveBeenCalledWith(
        credentials,
        clientConfig,
        'Users',
        'Find',
        {},
        { User_ID: '123' }
      )
    })

    it('should handle returnRawData config', async () => {
      const mockResponse = [{ id: '123', name: 'Test', age: '30' }]
      vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

      const rawConfig: Config = { ...config, returnRawData: true }

      const result = await findById(credentials, clientConfig, 'Users', rawConfig, userSchema, '123')

      expect(result).toEqual({ id: '123', name: 'Test', age: '30' })
    })
  })
})
