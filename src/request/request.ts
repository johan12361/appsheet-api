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
  // construir la URL de la API de AppSheet
  const apiUrl = `${clientConfig.url}/api/v2/apps/${credentials.appId}/tables/${table}/Action?applicationAccessKey=${credentials.apiKey}`

  // Configurar los encabezados
  const headers = {
    'Content-Type': 'application/json'
  }

  // Construir el cuerpo de la solicitud
  const body = {
    Action: action,
    Properties: {
      Locale: clientConfig.locale,
      Timezone: clientConfig.timezone,
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

  // validar que la respuesta contenga datos
  if (!response?.data) {
    throw new Error('La respuesta de AppSheet no contiene datos')
  }

  // verificar si la respuesta contiene datos
  if (response.data.Rows && Array.isArray(response.data.Rows)) {
    return response.data.Rows as AppsheetData[]
  }

  // asegurar que los datos de la respuesta sean un array
  const toArray = Array.isArray(response.data) ? response.data : [response.data]

  // devolver los datos como AppsheetData[]
  return toArray as AppsheetData[]
}
