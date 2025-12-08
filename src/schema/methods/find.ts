import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'

import type { ObjectData } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Row, Properties } from '../../types/request.js'

export async function find<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  row: Row | Row[] = [],
  properties: Properties = {}
): Promise<T[]> {
  // make request
  const response = await makeRequest(credentials, clientConfig, schemaId, 'Find', properties, row)

  // return raw data if config.rawData is true
  if (config.rawData) {
    return response as unknown as T[]
  }

  // build data
  const result: T[] = response.map((item) => buildData<T>(config, item, dataSchema))

  return result
}
