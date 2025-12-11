import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteRecord } from '../../../schema/methods/delete.js'
import * as requestModule from '../../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../../types/client.js'
import type { ObjectData } from '../../../types/objectData.js'

vi.mock('../../../request/request.js')

describe('deleteRecord', () => {
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

  it('should delete a record', async () => {
    const mockResponse = [
      {
        id: '123',
        name: 'Deleted User',
        email: 'deleted@example.com',
        age: '30',
        isActive: 'false'
      }
    ]

    vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

    const data = { id: '123' }

    const result = await deleteRecord(credentials, clientConfig, 'Users', config, userSchema, data)

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      config,
      'Users',
      'Delete',
      {},
      expect.objectContaining({ id: '123' })
    )

    expect(result).toEqual({
      id: '123',
      name: 'Deleted User',
      email: 'deleted@example.com',
      age: 30,
      isActive: false
    })
  })

  it('should throw error when no primary key in schema', async () => {
    const schemaWithoutPrimary = {
      name: { type: 'string' as const }
    }

    await expect(
      deleteRecord(credentials, clientConfig, 'Users', config, schemaWithoutPrimary, { name: 'Test' })
    ).rejects.toThrow('No primary key found in schema')
  })

  it('should throw error when primary key not in data', async () => {
    await expect(deleteRecord(credentials, clientConfig, 'Users', config, userSchema, {})).rejects.toThrow(
      "Primary key 'id' does not exist in the provided object"
    )
  })
})
