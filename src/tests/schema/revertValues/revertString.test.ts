import { describe, it, expect } from 'vitest'
import { revertString } from '../../../schema/revertValues/revertString.js'
import type { Data } from '../../../types/objectData.js'

describe('revertString', () => {
  it('should return string value', () => {
    const result = revertString({} as Data, 'hello world')
    expect(result).toBe('hello world')
  })

  it('should return empty string', () => {
    const result = revertString({} as Data, '')
    expect(result).toBe('')
  })

  it('should convert number to string', () => {
    const result = revertString({} as Data, 123)
    expect(result).toBe('123')
  })

  it('should handle undefined', () => {
    const result = revertString({} as Data, undefined)
    expect(result).toBeUndefined()
  })

  it('should handle function default', () => {
    const schema: Data = {
      type: 'string',
      default: () => 'generated-id-123'
    }
    const result = revertString(schema, undefined)
    expect(result).toBe('generated-id-123')
  })

  it('should handle static default', () => {
    const schema: Data = {
      type: 'string',
      default: 'default-value'
    }
    const result = revertString(schema, undefined)
    expect(result).toBe('default-value')
  })
})
