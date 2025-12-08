import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'
import type { ObjectData } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Row } from '../../types/request.js'

export async function findById<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  id: string
): Promise<T | undefined> {
  // key de id en el dataSchema
  const idKey = Object.keys(dataSchema).find((key) => dataSchema[key].primary === true)
  if (!idKey) {
    throw new Error('No ID key defined in data schema.')
  }

  // construir row para la consulta
  const key = dataSchema[idKey].key || idKey
  const row: Row = { [key]: id }

  // make request
  const response = await makeRequest(credentials, clientConfig, schemaId, 'Find', {}, row)

  // check if response is empty
  if (response.length === 0) {
    return undefined
  }

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
