import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMany } from '../../../schema/methods/createMany.js'
import * as requestModule from '../../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../../types/client.js'
import type { ObjectData } from '../../../types/objectData.js'

vi.mock('../../../request/request.js')

describe('createMany', () => {
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

  it('should create multiple records', async () => {
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

    const dataArray = [
      { name: 'User 1', email: 'user1@example.com', age: 25, isActive: true },
      { name: 'User 2', email: 'user2@example.com', age: 30, isActive: false }
    ]

    const result = await createMany(credentials, clientConfig, 'Users', config, userSchema, dataArray)

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      config,
      'Users',
      'Add',
      {},
      expect.arrayContaining([expect.objectContaining({ name: 'User 1' }), expect.objectContaining({ name: 'User 2' })])
    )

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: '1',
      name: 'User 1',
      email: 'user1@example.com',
      age: 25,
      isActive: true
    })
  })

  it('should handle returnRawData config', async () => {
    const mockResponse = [{ id: '1', name: 'Raw' }]
    vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

    const rawConfig = { ...config, returnRawData: true }
    const dataArray = [{ name: 'User 1' }]

    const result = await createMany(credentials, clientConfig, 'Users', rawConfig, userSchema, dataArray)

    expect(result).toEqual(mockResponse)
  })
})
