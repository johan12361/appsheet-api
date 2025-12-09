import { describe, it, expect } from 'vitest'
import { revertInteger } from '../../../schema/revertValues/revertInteger'

describe('revertInteger', () => {
  it('should return integer representation', () => {
    const result = revertInteger({} as any, 42)
    expect(result).toBe(42)
  })

  it('should handle negative integers', () => {
    const result = revertInteger({} as any, -10)
    expect(result).toBe(-10)
  })

  it('should handle zero', () => {
    const result = revertInteger({} as any, 0)
    expect(result).toBe(0)
  })

  it('should return undefined for NaN', () => {
    const result = revertInteger({} as any, 'not a number' as any)
    expect(result).toBeUndefined()
  })

  it('should truncate decimal numbers', () => {
    const result = revertInteger({} as any, 42.7)
    expect(result).toBe(42)
  })

  it('should handle large integers', () => {
    const result = revertInteger({} as any, 123456)
    expect(result).toBe(123456)
  })
})
