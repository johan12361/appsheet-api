import { describe, it, expect } from 'vitest'
import { buildArray } from '../../../schema/buildValues/buildArray'
import type { Data } from '../types/objectData'

describe('buildArray', () => {
  it('should return empty array for undefined input', () => {
    const schema: Data = { type: 'array', itemType: 'string' }
    const result = buildArray(schema, undefined, {} as any)
    expect(result).toEqual([])
  })

  it('should return empty array for empty string', () => {
    const schema: Data = { type: 'array', itemType: 'string' }
    const result = buildArray(schema, '', {} as any)
    expect(result).toEqual([''])
  })

  it('should parse comma-separated string values', () => {
    const schema: Data = { type: 'array', itemType: 'string' }
    const result = buildArray(schema, 'apple , banana , orange', {} as any)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should parse comma-separated numbers', () => {
    const schema: Data = { type: 'array', itemType: 'number' }
    const result = buildArray(schema, '1.5 , 2.7 , 3.9', {} as any)
    expect(result).toEqual([1.5, 2.7, 3.9])
  })

  it('should parse comma-separated integers', () => {
    const schema: Data = { type: 'array', itemType: 'integer' }
    const result = buildArray(schema, '10 , 20 , 30', {} as any)
    expect(result).toEqual([10, 20, 30])
  })

  it('should handle spaces around commas', () => {
    const schema: Data = { type: 'array', itemType: 'string' }
    const result = buildArray(schema, 'apple , banana , orange', {} as any)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should handle multiple spaces', () => {
    const schema: Data = { type: 'array', itemType: 'string' }
    const result = buildArray(schema, 'apple  ,  banana  ,  orange', {} as any)
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('should return array of strings when itemType is not specified', () => {
    const schema: Data = { type: 'array' }
    const result = buildArray(schema, 'a , b , c', {} as any)
    expect(result).toEqual([])
  })
})
