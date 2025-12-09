import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'
import { revertData } from '../revertData.js'

import type { ObjectData, GenericObject } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Properties, Row } from '../../types/request.js'

export async function create<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  data: GenericObject,
  properties: Properties = {}
): Promise<T> {
  let row: Row
  if (config.sendRawData) {
    row = data as Row
  } else {
    row = revertData(config, data, dataSchema)
  }

  const response = await makeRequest(credentials, clientConfig, config, schemaId, 'Add', properties, row)

  const singleItem = response[0]

  if (config.returnRawData) {
    return singleItem as unknown as T
  }

  const result: T = buildData<T>(config, singleItem, dataSchema)
  return result
}
