import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'
import { revertData } from '../revertData.js'

import type { ObjectData } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Properties, Row } from '../../types/request.js'

export async function updateMany<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  data: Partial<T>[],
  properties: Properties = {}
): Promise<T[]> {
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true)
  if (!primaryKeyEntry) {
    throw new Error('No primary key found in schema (property with primary: true)')
  }

  const [primaryKeyName] = primaryKeyEntry

  for (let i = 0; i < data.length; i++) {
    const item = data[i] as Record<string, unknown>
    if (!(primaryKeyName in item)) {
      throw new Error(`Primary key '${primaryKeyName}' does not exist in object at index ${i}`)
    }
  }

  let rows: Row[]
  if (config.sendRawData) {
    rows = data as Row[]
  } else {
    rows = data.map((item) => revertData(config, item as Record<string, unknown>, dataSchema))
  }

  const response = await makeRequest(credentials, clientConfig, config, schemaId, 'Edit', properties, rows)

  if (config.returnRawData) {
    return response as unknown as T[]
  }

  const result: T[] = response.map((item) => buildData<T>(config, item, dataSchema))
  return result
}
