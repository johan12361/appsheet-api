import { describe, it, expect } from 'vitest'
import { revertBool } from '../../../schema/revertValues/revertBool'

describe('revertBool', () => {
  it('should return true for boolean true', () => {
    const result = revertBool({} as any, true)
    expect(result).toBe(true)
  })

  it('should return false for boolean false', () => {
    const result = revertBool({} as any, false)
    expect(result).toBe(false)
  })

  it('should return true for truthy values', () => {
    const result = revertBool({} as any, 1)
    expect(result).toBe(true)
  })

  it('should return false for falsy values', () => {
    const result = revertBool({} as any, 0)
    expect(result).toBe(false)
  })

  it('should return false for null', () => {
    const result = revertBool({} as any, null)
    expect(result).toBe(false)
  })

  it('should return undefined for undefined', () => {
    const result = revertBool({} as any, undefined)
    expect(result).toBeUndefined()
  })
})
