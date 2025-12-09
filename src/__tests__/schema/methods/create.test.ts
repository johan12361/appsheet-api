import { describe, it, expect, vi, beforeEach } from 'vitest'
import { create } from '../../../schema/methods/create.js'
import * as requestModule from '../../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../../types/client.js'
import type { ObjectData } from '../../../types/objectData.js'

vi.mock('../../../request/request.js')

describe('create', () => {
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
      config,
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

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      rawConfig,
      'Users',
      'Add',
      {},
      data
    )
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
      config,
      'Users',
      'Add',
      properties,
      expect.any(Object)
    )
  })
})
