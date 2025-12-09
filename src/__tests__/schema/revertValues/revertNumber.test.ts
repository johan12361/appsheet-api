import { describe, it, expect } from 'vitest'
import { revertNumber } from '../../../schema/revertValues/revertNumber.js'
import type { Data } from '../../../types/objectData.js'

describe('revertNumber', () => {
  it('should return number representation', () => {
    const result = revertNumber({} as Data, 42.5)
    expect(result).toBe(42.5)
  })

  it('should handle negative numbers', () => {
    const result = revertNumber({} as Data, -10.25)
    expect(result).toBe(-10.25)
  })

  it('should handle zero', () => {
    const result = revertNumber({} as Data, 0)
    expect(result).toBe(0)
  })

  it('should return undefined for NaN', () => {
    const result = revertNumber({} as Data, NaN)
    expect(result).toBeUndefined()
  })

  it('should handle large numbers', () => {
    const result = revertNumber({} as Data, 123456.789)
    expect(result).toBe(123456.789)
  })
})
