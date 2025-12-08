import { Schema } from '../schema/schema.js'

// types
import type { Credentials, ClientConfig, Config } from '../types/client.js'
import type { ObjectData } from '../types/objectData.js'

const defaultConfig: Config = {
  timezone: 'UTC'
}

const defaultClientConfig: ClientConfig = {
  url: 'https://www.appsheet.com',
  locale: 'en-GB',
  timezone: process.env.TZ || 'UTC'
}

export class Client {
  readonly credentials: Credentials
  readonly config: Config
  readonly clientConfig: ClientConfig

  constructor(credentials: Credentials, config: Partial<Config> = {}, clientConfig: Partial<ClientConfig> = {}) {
    this.credentials = credentials
    this.config = {
      ...defaultConfig,
      ...config
    }
    this.clientConfig = {
      ...defaultClientConfig,
      ...clientConfig
    }
  }

  //ss create schema
  createSchema<T>(schemaId: string, data: ObjectData): Schema<T> {
    return new Schema<T>(this.credentials, this.config, this.clientConfig, schemaId, data)
  }
}
