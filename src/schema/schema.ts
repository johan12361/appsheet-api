import { findById } from './methods/findById.js'
import { find } from './methods/find.js'
import { create } from './methods/create.js'
import { createMany } from './methods/createMany.js'
import { update } from './methods/update.js'
import { updateMany } from './methods/updateMany.js'
import { deleteRecord } from './methods/delete.js'
import { deleteMany } from './methods/deleteMany.js'

import type { ObjectData } from '../types/objectData.js'
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

  async findById(id: string): Promise<T | undefined> {
    if (!id) {
      throw new Error('ID is required to find an item by ID.')
    }
    return findById<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, id)
  }

  async find(properties: Properties = {}, rows: Row | Row[] = []): Promise<T[]> {
    return find<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, properties, rows)
  }

  async create(data: Partial<T>, properties: Properties = {}): Promise<T> {
    return create<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties)
  }

  async createMany(dataArray: Partial<T>[], properties: Properties = {}): Promise<T[]> {
    return createMany<T>(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      dataArray,
      properties
    )
  }

  async update(data: Partial<T>, properties: Properties = {}): Promise<T> {
    return update<T>(this.credentials, this.clientConfig, this.schemaId, this.config, this.dataSchema, data, properties)
  }

  async updateMany(dataArray: Partial<T>[], properties: Properties = {}): Promise<T[]> {
    return updateMany<T>(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      dataArray,
      properties
    )
  }

  async delete(data: Partial<T>, properties: Properties = {}): Promise<T> {
    return deleteRecord<T>(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      data,
      properties
    )
  }

  async deleteMany(dataArray: Partial<T>[], properties: Properties = {}): Promise<T[]> {
    return deleteMany<T>(
      this.credentials,
      this.clientConfig,
      this.schemaId,
      this.config,
      this.dataSchema,
      dataArray,
      properties
    )
  }
}
