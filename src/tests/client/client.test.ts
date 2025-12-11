import { describe, it, expect, beforeEach } from 'vitest'
import { AppsheetClient } from '../../client/client.js'
import { Schema } from '../../schema/schema.js'
import type { Credentials, SystemContext } from '../../types/client.js'
import type { ObjectData } from '../../types/objectData.js'

describe('AppsheetClient', () => {
  const credentials: Credentials = {
    appId: 'test-app-id',
    apiKey: 'test-api-key'
  }

  const userSchema: ObjectData = {
    id: {
      type: 'string',
      primary: true
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    }
  }

  describe('constructor', () => {
    it('should create client with default system context', () => {
      const client = new AppsheetClient(credentials)

      expect(client).toBeInstanceOf(AppsheetClient)
    })

    it('should create client with custom system context', () => {
      const systemContext: Partial<SystemContext> = {
        config: {
          timezone: 'America/New_York',
          returnRawData: true,
          sendRawData: true
        },
        client: {
          url: 'https://custom.appsheet.com',
          locale: 'en-US',
          timezone: 'America/New_York'
        }
      }

      const client = new AppsheetClient(credentials, systemContext)

      expect(client).toBeInstanceOf(AppsheetClient)
    })

    it('should merge partial system context with defaults', () => {
      const systemContext: Partial<SystemContext> = {
        config: {
          timezone: 'Europe/Madrid',
          returnRawData: false,
          sendRawData: false
        }
      }

      const client = new AppsheetClient(credentials, systemContext)

      expect(client).toBeInstanceOf(AppsheetClient)
    })

    it('should accept only credentials', () => {
      const client = new AppsheetClient(credentials)

      expect(client).toBeInstanceOf(AppsheetClient)
    })
  })

  describe('createSchema', () => {
    let client: AppsheetClient

    beforeEach(() => {
      client = new AppsheetClient(credentials)
    })

    it('should create a schema instance', () => {
      const schema = client.createSchema('Users', userSchema)

      expect(schema).toBeInstanceOf(Schema)
    })

    it('should create schema with custom table name', () => {
      const schema = client.createSchema('CustomTableName', userSchema)

      expect(schema).toBeInstanceOf(Schema)
    })

    it('should create multiple schemas', () => {
      const usersSchema = client.createSchema('Users', userSchema)
      const productsSchema = client.createSchema('Products', {
        id: { type: 'string', primary: true },
        name: { type: 'string' },
        price: { type: 'number' }
      })

      expect(usersSchema).toBeInstanceOf(Schema)
      expect(productsSchema).toBeInstanceOf(Schema)
    })

    it('should create schema with complex data types', () => {
      const complexSchema: ObjectData = {
        id: { type: 'string', primary: true },
        name: { type: 'string' },
        age: { type: 'integer' },
        salary: { type: 'number' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'date' },
        tags: { type: 'array', itemType: 'string' },
        metadata: {
          type: 'object',
          properties: {
            department: { type: 'string' },
            level: { type: 'integer' }
          }
        }
      }

      const schema = client.createSchema('Employees', complexSchema)

      expect(schema).toBeInstanceOf(Schema)
    })

    it('should pass config to schema', () => {
      const systemContext: Partial<SystemContext> = {
        config: {
          timezone: 'America/Bogota',
          returnRawData: false,
          sendRawData: false
        },
        client: {
          url: 'https://www.appsheet.com',
          locale: 'en-US',
          timezone: 'America/Bogota'
        }
      }

      const client = new AppsheetClient(credentials, systemContext)
      const schema = client.createSchema('Users', userSchema)

      expect(schema).toBeInstanceOf(Schema)
    })
  })

  describe('integration', () => {
    it('should create client and schema for typical use case', () => {
      const client = new AppsheetClient({
        appId: 'my-app',
        apiKey: 'my-key'
      })

      const users = client.createSchema('Users', {
        id: { type: 'string', primary: true },
        name: { type: 'string' },
        email: { type: 'string' }
      })

      expect(client).toBeInstanceOf(AppsheetClient)
      expect(users).toBeInstanceOf(Schema)
    })

    it('should create client with timezone configuration', () => {
      const client = new AppsheetClient(
        {
          appId: 'my-app',
          apiKey: 'my-key'
        },
        {
          config: {
            timezone: 'America/Mexico_City',
            returnRawData: false,
            sendRawData: false
          }
        }
      )

      const orders = client.createSchema('Orders', {
        orderId: { type: 'string', primary: true },
        orderDate: { type: 'date' }
      })

      expect(client).toBeInstanceOf(AppsheetClient)
      expect(orders).toBeInstanceOf(Schema)
    })
  })
})
