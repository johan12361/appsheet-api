import axios from 'axios'

import catchError from '../utils/catchError.js'

import type { Credentials } from '../types/credentials.js'
import type { ClientConfig } from '../types/clientConfig.js'

export async function makeRequest<T>(
  config: ClientConfig,
  table: string,
  properties = {},
  action: string,
  rows: unknown[] | unknown,
  credentials: Credentials
): Promise<T> {
  // construir la URL de la API de AppSheet
  const apiUrl = `${config.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`

  // Configurar los encabezados
  const headers = {
    'Content-Type': 'application/json'
  }

  // Construir el cuerpo de la solicitud
  const body = {
    Action: action,
    Properties: {
      Locale: config.locale,
      Timezone: config.timezone,
      ...properties
    },
    Rows: !Array.isArray(rows) ? [rows] : rows
  }

  // Realizar la solicitud POST a la API de AppSheet
  const [error, response] = await catchError(axios.post(apiUrl, body, { headers }))

  // manejar errores de la solicitud
  if (error) {
    throw error
  }

  return response.data as T
}
