import { makeRequest } from '../request/request.js'
import { buildData } from './buildData.js'

import type { ObjectData } from '../types/objectData.js'
import type { Credentials } from '../types/credentials.js'
import type { ClientConfig } from '../types/clientConfig.js'
import type { Row, Properties } from '../types/request.js'

export class Schema<T> {
  readonly credentials: Credentials
  readonly config: ClientConfig

  readonly schemaId: string
  readonly dataSchema: ObjectData

  constructor(credentials: Credentials, config: ClientConfig, schemaId: string, dataSchema: ObjectData) {
    this.credentials = credentials
    this.config = config
    this.schemaId = schemaId
    this.dataSchema = dataSchema
  }

  //ss get all items
  async find(rows: Row | Row[] = [], properties: Properties = {}): Promise<T[]> {
    const response = await makeRequest(this.credentials, this.config, this.schemaId, 'Find', properties, rows)

    //TODO: convert response to T[] on base of this.dataSchema
    const result: T[] = response.map((item) => buildData<T>(item, this.dataSchema))

    return result
  }
}
