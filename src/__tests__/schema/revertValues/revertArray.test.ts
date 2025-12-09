import { describe, it, expect } from 'vitest'
import { revertArray } from '../../../schema/revertValues/revertArray'

describe('revertArray', () => {
  it('should convert array of strings to comma-separated string', () => {
    const result = revertArray({} as any, ['apple', 'banana', 'cherry'])
    expect(result).toBe('apple , banana , cherry')
  })

  it('should convert array of numbers to comma-separated string', () => {
    const result = revertArray({} as any, [1, 2, 3])
    expect(result).toBe('1 , 2 , 3')
  })

  it('should convert array of booleans to comma-separated string', () => {
    const result = revertArray({} as any, [true, false, true])
    expect(result).toBe('true , false , true')
  })

  it('should handle empty array', () => {
    const result = revertArray({} as any, [])
    expect(result).toBe('')
  })

  it('should handle single element array', () => {
    const result = revertArray({} as any, ['single'])
    expect(result).toBe('single')
  })

  it('should handle mixed types in array', () => {
    const result = revertArray({} as any, ['text', 42, true])
    expect(result).toBe('text , 42 , true')
  })
})
