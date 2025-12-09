import { describe, it, expect } from 'vitest'
import { buildInteger } from '../../../schema/buildValues/buildInteger.js'
import type { Data } from '../../../types/objectData.js'

describe('buildInteger', () => {
  it('should return undefined for undefined input', () => {
    const result = buildInteger({} as Data, undefined)
    expect(result).toBeUndefined()
  })

  it('should parse valid integer string', () => {
    const result = buildInteger({} as Data, '42')
    expect(result).toBe(42)
  })

  it('should parse negative integer', () => {
    const result = buildInteger({} as Data, '-10')
    expect(result).toBe(-10)
  })

  it('should return undefined for invalid integer', () => {
    const result = buildInteger({} as Data, 'not a number')
    expect(result).toBeUndefined()
  })

  it('should parse zero', () => {
    const result = buildInteger({} as Data, '0')
    expect(result).toBe(0)
  })

  it('should truncate decimal numbers', () => {
    const result = buildInteger({} as Data, '42.7')
    expect(result).toBe(42)
  })
})
