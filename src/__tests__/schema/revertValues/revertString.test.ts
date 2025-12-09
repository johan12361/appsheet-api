import { describe, it, expect } from 'vitest'
import { revertString } from '../../../schema/revertValues/revertString'

describe('revertString', () => {
  it('should return string value', () => {
    const result = revertString({} as any, 'hello world')
    expect(result).toBe('hello world')
  })

  it('should return empty string', () => {
    const result = revertString({} as any, '')
    expect(result).toBe('')
  })

  it('should convert number to string', () => {
    const result = revertString({} as any, 123 as any)
    expect(result).toBe('123')
  })

  it('should handle undefined', () => {
    const result = revertString({} as any, undefined)
    expect(result).toBeUndefined()
  })
})
