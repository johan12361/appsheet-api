import { describe, it, expect } from 'vitest'
import { buildData } from '../../schema/buildData'
import type { ObjectData } from '../types/objectData'
import type { Config } from '../types/client'
import type { AppsheetData } from '../types/request'

describe('buildData', () => {
  const config: Config = {
    timezone: 'UTC',
    returnRawData: false,
    sendRawData: false
  }

  it('should build data from basic types', () => {
    const schema: ObjectData = {
      name: { type: 'string' },
      age: { type: 'number' },
      active: { type: 'boolean' }
    }

    const item: AppsheetData = {
      name: 'John Doe',
      age: '30',
      active: 'true'
    }

    const result = buildData(config, item, schema)
    expect(result).toEqual({
      name: 'John Doe',
      age: 30,
      active: true
    })
  })

  it('should handle custom key mapping', () => {
    const schema: ObjectData = {
      userName: { type: 'string', key: 'user_name' }
    }

    const item: AppsheetData = {
      user_name: 'johndoe'
    }

    const result = buildData(config, item, schema)
    expect(result).toEqual({
      userName: 'johndoe'
    })
  })

  it('should skip missing fields', () => {
    const schema: ObjectData = {
      name: { type: 'string' },
      age: { type: 'number' }
    }

    const item: AppsheetData = {
      name: 'John Doe'
    }

    const result = buildData(config, item, schema)
    expect(result).toEqual({
      name: 'John Doe'
    })
    expect(result).not.toHaveProperty('age')
  })

  it('should handle nested objects', () => {
    const schema: ObjectData = {
      name: { type: 'string' },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' }
        }
      }
    }

    const item: AppsheetData = {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York'
    }

    const result = buildData(config, item, schema)
    expect(result).toEqual({
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'New York'
      }
    })
  })

  it('should handle arrays', () => {
    const schema: ObjectData = {
      tags: { type: 'array', itemType: 'string' }
    }

    const item: AppsheetData = {
      tags: 'tag1 , tag2 , tag3'
    }

    const result = buildData(config, item, schema)
    expect(result).toEqual({
      tags: ['tag1', 'tag2', 'tag3']
    })
  })
})
