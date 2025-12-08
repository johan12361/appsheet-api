import { findById } from './methods/findById.js'
import { find } from './methods/find.js'

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

  //ss get single item
  async findById(id: string): Promise<T | undefined> {
    if (!id) {
      throw new Error('ID is required to find an item by ID.')
    }
    return findById<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, id)
  }

  //ss get multiple items
  async find(rows: Row | Row[] = [], properties: Properties = {}): Promise<T[]> {
    return find<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, rows, properties)
  }
}
