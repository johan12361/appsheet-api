import { describe, it, expect, vi, beforeEach } from 'vitest'
import { update } from '../../../schema/methods/update.js'
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

describe('update', () => {
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

  it('should update an existing record', async () => {
    const mockResponse = [
      {
        id: '123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: '35',
        isActive: 'true'
      }
    ]

    vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

    const data = {
      id: '123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 35,
      isActive: true
    }

    const result = await update<User>(credentials, clientConfig, 'Users', config, userSchema, data)

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      config,
      'Users',
      'Edit',
      {},
      expect.objectContaining({
        id: '123',
        name: 'Jane Doe'
      })
    )

    expect(result).toEqual({
      id: '123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 35,
      isActive: true
    })
  })

  it('should throw error when no primary key in schema', async () => {
    const schemaWithoutPrimary = {
      name: { type: 'string' as const }
    }

    await expect(
      update(credentials, clientConfig, 'Users', config, schemaWithoutPrimary, { name: 'Test' })
    ).rejects.toThrow('No primary key found in schema')
  })

  it('should throw error when primary key not in data', async () => {
    const data = {
      name: 'Jane Doe'
    }

    await expect(update(credentials, clientConfig, 'Users', config, userSchema, data)).rejects.toThrow(
      "Primary key 'id' does not exist in the provided object"
    )
  })

  it('should handle sendRawData config', async () => {
    const mockResponse = [{ id: '123', name: 'Raw' }]
    vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

    const rawConfig = { ...config, sendRawData: true }
    const rawData = { id: '123', name: 'Raw' }

    await update(credentials, clientConfig, 'Users', rawConfig, userSchema, rawData)

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      rawConfig,
      'Users',
      'Edit',
      {},
      rawData
    )
  })
})
