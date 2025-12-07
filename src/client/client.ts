import { Schema } from '../schema/schema.js'

// types
import type { Credentials } from '../types/credentials.js'
import type { ClientConfig } from '../types/clientConfig.js'
import type { ObjectData } from '../types/objectData.js'

const defaultConfig: ClientConfig = {
  url: 'https://www.appsheet.com',
  locale: 'en-GB',
  timezone: 'UTC'
}

export class Client {
  readonly credentials: Credentials
  readonly config: ClientConfig

  constructor(credentials: Credentials, config: Partial<ClientConfig> = {}) {
    this.credentials = credentials
    this.config = {
      ...defaultConfig,
      ...config
    }
  }

  //ss create schema
  createSchema<T>(schemaId: string, data: ObjectData): Schema<T> {
    return new Schema<T>(this.credentials, this.config, schemaId, data)
  }
}
