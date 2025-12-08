import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'
import { revertData } from '../revertData.js'

import type { ObjectData, GenericObject } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Properties, Row } from '../../types/request.js'

export async function update<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  data: GenericObject,
  properties: Properties = {}
): Promise<T> {
  // find primary key in schema
  const primaryKeyEntry = Object.entries(dataSchema).find(([, value]) => value.primary === true)
  if (!primaryKeyEntry) {
    throw new Error('No primary key found in schema (property with primary: true)')
  }

  const [primaryKeyName] = primaryKeyEntry

  // check if primary key exists in data
  if (!(primaryKeyName in data)) {
    throw new Error(`Primary key '${primaryKeyName}' does not exist in the provided object`)
  }

  let row: Row
  if (config.sendRawData) {
    row = data as Row
  } else {
    row = revertData(config, data, dataSchema)
  }

  // make request
  const response = await makeRequest(credentials, clientConfig, schemaId, 'Edit', properties, row)

  // check if response is empty
  const singleItem = response[0]

  // return raw data if config.returnRawData is true
  if (config.returnRawData) {
    return singleItem as unknown as T
  }

  // build data
  const result: T = buildData<T>(config, singleItem, dataSchema)
  return result
}
