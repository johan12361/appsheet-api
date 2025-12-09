import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteMany } from '../../../schema/methods/deleteMany.js'
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

describe('deleteMany', () => {
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

  it('should delete multiple records', async () => {
    const mockResponse = [
      {
        id: '1',
        name: 'Deleted User 1',
        email: 'deleted1@example.com',
        age: '25',
        isActive: 'false'
      },
      {
        id: '2',
        name: 'Deleted User 2',
        email: 'deleted2@example.com',
        age: '30',
        isActive: 'false'
      }
    ]

    vi.mocked(requestModule.makeRequest).mockResolvedValue(mockResponse)

    const dataArray = [{ id: '1' }, { id: '2' }]

    const result = await deleteMany<User>(credentials, clientConfig, 'Users', config, userSchema, dataArray)

    expect(requestModule.makeRequest).toHaveBeenCalledWith(
      credentials,
      clientConfig,
      config,
      'Users',
      'Delete',
      {},
      expect.arrayContaining([expect.objectContaining({ id: '1' }), expect.objectContaining({ id: '2' })])
    )

    expect(result).toHaveLength(2)
    expect(result[0].isActive).toBe(false)
  })

  it('should throw error when no primary key in schema', async () => {
    const schemaWithoutPrimary = {
      name: { type: 'string' as const }
    }

    await expect(
      deleteMany(credentials, clientConfig, 'Users', config, schemaWithoutPrimary, [{ name: 'Test' }])
    ).rejects.toThrow('No primary key found in schema')
  })

  it('should throw error when primary key missing in one object', async () => {
    const dataArray = [{ id: '1' }, { name: 'User 2' }]

    await expect(deleteMany(credentials, clientConfig, 'Users', config, userSchema, dataArray)).rejects.toThrow(
      "Primary key 'id' does not exist in object at index 1"
    )
  })
})
