import { makeRequest } from '../request/request.js'
import { buildData } from './buildData.js'

import type { ObjectData } from '../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../types/client.js'
import type { Row, Properties } from '../types/request.js'

export class Schema<T> {
  readonly credentials: Credentials
  readonly config: Config
  readonly clientConfig: ClientConfig

  readonly schemaId: string
  readonly dataSchema: ObjectData

  constructor(
    credentials: Credentials,
    config: Config,
    clientConfig: ClientConfig,
    schemaId: string,
    dataSchema: ObjectData
  ) {
    this.credentials = credentials
    this.config = config
    this.clientConfig = clientConfig
    this.schemaId = schemaId
    this.dataSchema = dataSchema
  }

  //ss get all items
  async find(rows: Row | Row[] = [], properties: Properties = {}): Promise<T[]> {
    const response = await makeRequest(this.credentials, this.clientConfig, this.schemaId, 'Find', properties, rows)

    //TODO: convert response to T[] on base of this.dataSchema
    const result: T[] = response.map((item) => buildData<T>(this.config, item, this.dataSchema))

    return result
  }
}
