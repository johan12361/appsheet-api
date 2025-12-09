import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findById } from '../../../schema/methods/findById.js'
import * as requestModule from '../../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../../types/client.js'
import type { ObjectData } from '../../../types/objectData.js'

vi.mock('../../../request/request.js')

describe('findById', () => {
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
      config,
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
      config,
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
