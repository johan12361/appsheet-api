import { Schema } from '../schema/schema.js'

// types
import type { Credentials, SystemContext } from '../types/client.js'
import type { ObjectData } from '../types/objectData.js'

// default configs
const defaultSystemContext: SystemContext = {
  config: {
    timezone: 'UTC',
    returnRawData: false,
    sendRawData: false
  },
  client: {
    url: 'https://www.appsheet.com',
    locale: 'en-GB',
    timezone: process.env.TZ || 'UTC'
  }
}

export class AppsheetClient {
  private readonly credentials: Credentials
  private readonly systemContext: SystemContext

  constructor(credentials: Credentials, systemContext: Partial<SystemContext> = {}) {
    this.credentials = credentials
    this.systemContext = {
      config: {
        ...defaultSystemContext.config,
        ...systemContext?.config
      },
      client: {
        ...defaultSystemContext.client,
        ...systemContext?.client
      }
    }
  }

  //ss create schema
  createSchema<T>(schemaId: string, data: ObjectData): Schema<T> {
    return new Schema<T>(this.credentials, this.systemContext.config, this.systemContext.client, schemaId, data)
  }
}
