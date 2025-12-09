import { describe, it, expect } from 'vitest'
import { revertData } from '../../schema/revertData.js'
import type { ObjectData } from '../../types/objectData.js'
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

    const item: Record<string, unknown> = {
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

    const item: Record<string, unknown> = {
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

    const item: Record<string, unknown> = {
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

    const item: Record<string, unknown> = {
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

    const item: Record<string, unknown> = {
      count: 42
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      count: 42
    })
  })

  it('should handle function defaults for missing fields', () => {
    const schema: ObjectData = {
      id: {
        type: 'string',
        default: () => 'generated-id-123'
      },
      createdAt: {
        type: 'date',
        default: () => new Date(2023, 11, 25, 10, 30, 0)
      },
      score: {
        type: 'number',
        default: () => 100
      },
      name: {
        type: 'string'
      }
    }

    const item: Record<string, unknown> = {
      name: 'Test User'
      // id, createdAt, and score will use function defaults
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      id: 'generated-id-123',
      createdAt: '2023-12-25 10:30:00',
      score: 100,
      name: 'Test User'
    })
  })

  it('should skip fields with undefined values and no defaults', () => {
    // revertData skips processing when data[key] === undefined and no default exists
    const schema: ObjectData = {
      id: {
        type: 'string'
        // No default provided
      },
      name: {
        type: 'string'
      }
    }

    const item: Record<string, unknown> = {
      id: undefined, // This will be skipped by revertData
      name: 'Test User'
    }

    const result = revertData(config, item, schema)
    // id is skipped because data[key] === undefined and no default
    expect(result).toEqual({
      name: 'Test User'
    })
    expect(result).not.toHaveProperty('id')
  })

  it('should not call function defaults when values are provided', () => {
    let functionCalled = false
    const schema: ObjectData = {
      name: {
        type: 'string',
        default: () => {
          functionCalled = true
          return 'default-name'
        }
      }
    }

    const item: Record<string, unknown> = {
      name: 'Actual Name'
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      name: 'Actual Name'
    })
    expect(functionCalled).toBe(false)
  })

  it('should handle mixed static and dynamic defaults', () => {
    // This test demonstrates that defaults work when fields are missing
    const schema: ObjectData = {
      status: {
        type: 'string',
        default: 'active'
      },
      code: {
        type: 'string',
        default: () => 'DYN-123'
      },
      name: {
        type: 'string'
      }
    }

    const item: Record<string, unknown> = {
      name: 'Test User'
      // status and code not provided - defaults will be applied
    }

    const result = revertData(config, item, schema)
    expect(result).toEqual({
      status: 'active',
      code: 'DYN-123',
      name: 'Test User'
    })
  })
})

