import { makeRequest } from '../request/request.js'

import type { ObjectData } from '../types/objectData.js'
import type { Credentials } from '../types/credentials.js'
import type { ClientConfig } from '../types/clientConfig.js'

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
  async getAll(): Promise<T[]> {
    const response = await makeRequest(this.config, this.schemaId, {}, 'Find', [], this.credentials)

    //TODO: convert response to T[] on base of this.dataSchema
    return response as T[]
  }
}
