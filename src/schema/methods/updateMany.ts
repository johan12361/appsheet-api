import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'
import { revertData } from '../revertData.js'

import type { ObjectData, GenericObject } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Properties, Row } from '../../types/request.js'

export async function updateMany<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  dataArray: GenericObject[],
  properties: Properties = {}
): Promise<T[]> {
  // find primary key in schema
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true)
  if (!primaryKeyEntry) {
    throw new Error('No primary key found in schema (property with primary: true)')
  }

  const [primaryKeyName] = primaryKeyEntry

  // check if primary key exists in all data objects
  for (let i = 0; i < dataArray.length; i++) {
    const data = dataArray[i]
    if (!(primaryKeyName in data)) {
      throw new Error(`Primary key '${primaryKeyName}' does not exist in object at index ${i}`)
    }
  }

  let rows: Row[]
  if (config.sendRawData) {
    rows = dataArray as Row[]
  } else {
    rows = dataArray.map((data) => revertData(config, data, dataSchema))
  }

  // make request
  const response = await makeRequest(credentials, clientConfig, schemaId, 'Edit', properties, rows)

  // return raw data if config.returnRawData is true
  if (config.returnRawData) {
    return response as unknown as T[]
  }

  // build data
  const result: T[] = response.map((item) => buildData<T>(config, item, dataSchema))
  return result
}
