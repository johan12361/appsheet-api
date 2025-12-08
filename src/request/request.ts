import axios from 'axios'

import catchError from '../utils/catchError.js'

import type { Credentials, ClientConfig } from '../types/client.js'
import type { Row, Properties, AppsheetData } from '../types/request.js'

export async function makeRequest(
  credentials: Credentials,
  clientConfig: ClientConfig,
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

  const [error, response] = await catchError(axios.post(apiUrl, body, { headers }))

  if (error) {
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
  return toArray as AppsheetData[]
}
