import { describe, it, expect } from 'vitest'
import { buildInteger } from '../../../schema/buildValues/buildInteger'

describe('buildInteger', () => {
  it('should return undefined for undefined input', () => {
    const result = buildInteger({} as any, undefined, {} as any)
    expect(result).toBeUndefined()
  })

  it('should parse valid integer string', () => {
    const result = buildInteger({} as any, '42', {} as any)
    expect(result).toBe(42)
  })

  it('should parse negative integer', () => {
    const result = buildInteger({} as any, '-10', {} as any)
    expect(result).toBe(-10)
  })

  it('should return undefined for invalid integer', () => {
    const result = buildInteger({} as any, 'not a number', {} as any)
    expect(result).toBeUndefined()
  })

  it('should parse zero', () => {
    const result = buildInteger({} as any, '0', {} as any)
    expect(result).toBe(0)
  })

  it('should truncate decimal numbers', () => {
    const result = buildInteger({} as any, '42.7', {} as any)
    expect(result).toBe(42)
  })
})
