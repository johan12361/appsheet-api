import axios from 'axios'

import catchError from '../utils/catchError.js'

import type { Credentials, ClientConfig, Config } from '../types/client.js'
import type { Row, Properties, AppsheetData } from '../types/request.js'

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function makeRequest(
  credentials: Credentials,
  clientConfig: ClientConfig,
  config: Config,
  table: string,
  action: string,
  properties: Properties = {},
  rows: Row | Row[]
): Promise<AppsheetData[]> {
  const apiUrl = `${clientConfig.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`

  const headers = {
    'Content-Type': 'application/json'
  }

  const body = {
    Action: action,
    Properties: {
      Locale: clientConfig.locale,
      Timezone: clientConfig.timezone,
      ...properties
    },
    Rows: !Array.isArray(rows) ? [rows] : rows
  }

  const maxRetries = config.maxRetriesOnRateLimit ?? 3
  const retryDelay = config.retryDelay ?? 1000

  let lastError: unknown = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const [error, response] = await catchError(axios.post(apiUrl, body, { headers }))

    if (error) {
      // Check if it's a 429 rate limit error
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        lastError = error

        // If we haven't exhausted retries, wait and try again
        if (attempt < maxRetries) {
          await sleep(retryDelay * (attempt + 1)) // Exponential backoff
          continue
        }
      }

      // For non-429 errors or exhausted retries, throw immediately
      throw error
    }

    if (!response?.data) {
      throw new Error('AppSheet response does not contain data')
    }

    if (response.data.Rows && Array.isArray(response.data.Rows)) {
      return response.data.Rows as AppsheetData[]
    }

    const toArray = Array.isArray(response.data) ? response.data : [response.data]

    return toArray as AppsheetData[]
  }

  // If we get here, we exhausted all retries on 429 errors
  throw lastError
}
