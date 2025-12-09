import { makeRequest } from '../../request/request.js'
import { buildData } from '../buildData.js'
import { revertData } from '../revertData.js'

import type { ObjectData } from '../../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../../types/client.js'
import type { Properties, Row } from '../../types/request.js'

export async function createMany<T>(
  credentials: Credentials,
  clientConfig: ClientConfig,
  schemaId: string,
  config: Config,
  dataSchema: ObjectData,
  data: Partial<T>[],
  properties: Properties = {}
): Promise<T[]> {
  let rows: Row[]
  if (config.sendRawData) {
    rows = data as Row[]
  } else {
    rows = data.map((item) => revertData(config, item as Record<string, unknown>, dataSchema))
  }

  const response = await makeRequest(credentials, clientConfig, config, schemaId, 'Add', properties, rows)

  if (config.returnRawData) {
    return response as unknown as T[]
  }

  const result: T[] = response.map((item) => buildData<T>(config, item, dataSchema))
  return result
}
