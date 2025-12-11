import { describe, it, expect, vi, beforeEach } from 'vitest'
import { find } from '../../../schema/methods/find.js'
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

describe('find', () => {
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

    expect(requestModule.makeRequest).toHaveBeenCalledWith(credentials, clientConfig, config, 'Users', 'Find', {}, [])

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

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      config,
      'Users',
      'Find',
      properties,
      []
    )

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

    expect(requestModule.makeRequest).toHaveBeenCalledWith(credentials, clientConfig, config, 'Users', 'Find', {}, rows)

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
