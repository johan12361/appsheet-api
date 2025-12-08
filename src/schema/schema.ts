import { findById } from './methods/findById.js'
import { find } from './methods/find.js'
import { create } from './methods/create.js'

import type { ObjectData, GenericObject } from '../types/objectData.js'
import type { Credentials, ClientConfig, Config } from '../types/client.js'
import type { Row, Properties } from '../types/request.js'

export class Schema<T> {
  private readonly credentials: Credentials
  private readonly config: Config
  private readonly clientConfig: ClientConfig

  private readonly schemaId: string
  private readonly dataSchema: ObjectData

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
  async find(properties: Properties = {}, rows: Row | Row[] = []): Promise<T[]> {
    return find<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, properties, rows)
  }

  //ss create item
  async create(data: GenericObject, properties: Properties = {}): Promise<T> {
    return create<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties)
  }
}
