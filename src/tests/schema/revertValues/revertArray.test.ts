import { describe, it, expect } from 'vitest'
import { revertArray } from '../../../schema/revertValues/revertArray.js'
import type { Data } from '../../../types/objectData.js'

describe('revertArray', () => {
  it('should convert array of strings to comma-separated string', () => {
    const result = revertArray({} as Data, ['apple', 'banana', 'cherry'])
    expect(result).toBe('apple , banana , cherry')
  })

  it('should convert array of numbers to comma-separated string', () => {
    const result = revertArray({} as Data, [1, 2, 3])
    expect(result).toBe('1 , 2 , 3')
  })

  it('should convert array of booleans to comma-separated string', () => {
    const result = revertArray({} as Data, [true, false, true])
    expect(result).toBe('true , false , true')
  })

  it('should handle empty array', () => {
    const result = revertArray({} as Data, [])
    expect(result).toBe('')
  })

  it('should handle single element array', () => {
    const result = revertArray({} as Data, ['single'])
    expect(result).toBe('single')
  })

  it('should handle mixed types in array', () => {
    const result = revertArray({} as Data, ['text', 42, true])
    expect(result).toBe('text , 42 , true')
  })
})
