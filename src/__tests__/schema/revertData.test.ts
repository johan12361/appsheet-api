import { describe, it, expect } from 'vitest'
import { revertData } from '../../schema/revertData.js'
import type { ObjectData, GenericObject } from '../../types/objectData.js'
import type { Config } from '../../types/client.js'

describe('revertData', () => {
  const config: Config = {
    timezone: 'UTC',
    returnRawData: false,
    sendRawData: false
  }

  it('should revert data to AppSheet format', () => {
    const schema: ObjectData = {
      name: { type: 'string' },
      age: { type: 'number' },
      active: { type: 'boolean' }
    }

    const item: GenericObject = {
      name: 'John Doe',
      age: 30,
      active: true
    }

    const result = revertData(config, item, schema)
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

    const item: GenericObject = {
      userName: 'johndoe'
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      user_name: 'johndoe'
    })
  })

  it('should skip missing fields', () => {
    const schema: ObjectData = {
      name: { type: 'string' },
      age: { type: 'number' }
    }

    const item: GenericObject = {
      name: 'John Doe'
    }

    const result = revertData(config, item, schema)
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

    const item: GenericObject = {
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'New York'
      }
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York'
    })
  })

  it('should handle integers', () => {
    const schema: ObjectData = {
      count: { type: 'integer' }
    }

    const item: GenericObject = {
      count: 42
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      count: 42
    })
  })
})
