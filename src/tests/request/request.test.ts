import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { makeRequest } from '../../request/request.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Row } from '../../types/request.js'

// Mock axios
vi.mock('axios')

describe('makeRequest', () => {
  const credentials: Credentials = {
    appId: 'test-app-id',
    apiKey: 'test-api-key'
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should make successful API request with single row', async () => {
    const mockResponse = {
      data: {
        Rows: [{ id: '1', name: 'Test User' }]
      }
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    const row: Row = { id: '1' }
    const result = await makeRequest(credentials, clientConfig, config, 'Users', 'Find', {}, row)

    expect(axios.post).toHaveBeenCalledWith(
      'https://www.appsheet.com/api/v2/apps/test-app-id/tables/Users/Action?applicationAccessKey=test-api-key',
      {
        Action: 'Find',
        Properties: {
          Locale: 'en-GB',
          Timezone: 'UTC'
        },
        Rows: [row]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    expect(result).toEqual([{ id: '1', name: 'Test User' }])
  })

  it('should make successful API request with multiple rows', async () => {
    const mockResponse = {
      data: {
        Rows: [
          { id: '1', name: 'User 1' },
          { id: '2', name: 'User 2' }
        ]
      }
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    const rows: Row[] = [{ id: '1' }, { id: '2' }]
    const result = await makeRequest(credentials, clientConfig, config, 'Users', 'Find', {}, rows)

    expect(result).toEqual([
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' }
    ])
  })

  it('should handle custom properties', async () => {
    const mockResponse = {
      data: {
        Rows: [{ id: '1' }]
      }
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    const properties = {
      Selector: 'Filter(Users, [age] > 21)',
      UserEmail: 'admin@example.com'
    }

    await makeRequest(credentials, clientConfig, config, 'Users', 'Find', properties, { id: '1' })

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        Properties: {
          Locale: 'en-GB',
          Timezone: 'UTC',
          Selector: 'Filter(Users, [age] > 21)',
          UserEmail: 'admin@example.com'
        }
      }),
      expect.any(Object)
    )
  })

  it('should handle response without Rows property', async () => {
    const mockResponse = {
      data: [{ id: '1', name: 'Test User' }]
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    const result = await makeRequest(credentials, clientConfig, config, 'Users', 'Find', {}, { id: '1' })

    expect(result).toEqual([{ id: '1', name: 'Test User' }])
  })

  it('should handle response with non-array data', async () => {
    const mockResponse = {
      data: { id: '1', name: 'Test User' }
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    const result = await makeRequest(credentials, clientConfig, config, 'Users', 'Find', {}, { id: '1' })

    expect(result).toEqual([{ id: '1', name: 'Test User' }])
  })

  it('should throw error when API request fails', async () => {
    const mockError = new Error('Network error')
    vi.mocked(axios.post).mockRejectedValue(mockError)

    await expect(makeRequest(credentials, clientConfig, config, 'Users', 'Find', {}, { id: '1' })).rejects.toThrow(
      'Network error'
    )
  })

  it('should throw error when response does not contain data', async () => {
    const mockResponse = {
      data: null
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    await expect(makeRequest(credentials, clientConfig, config, 'Users', 'Find', {}, { id: '1' })).rejects.toThrow(
      'AppSheet response does not contain data'
    )
  })

  it('should handle different actions (Add, Edit, Delete)', async () => {
    const mockResponse = {
      data: {
        Rows: [{ id: '1', name: 'New User' }]
      }
    }

    vi.mocked(axios.post).mockResolvedValue(mockResponse)

    await makeRequest(credentials, clientConfig, config, 'Users', 'Add', {}, { name: 'New User' })

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        Action: 'Add'
      }),
      expect.any(Object)
    )
  })
})
