import { describe, it, expect } from 'vitest'
import { revertBool } from '../../../schema/revertValues/revertBool.js'
import type { Data } from '../../../types/objectData.js'

describe('revertBool', () => {
  it('should return true for boolean true', () => {
    const result = revertBool({} as Data, true)
    expect(result).toBe(true)
  })

  it('should return false for boolean false', () => {
    const result = revertBool({} as Data, false)
    expect(result).toBe(false)
  })

  it('should return true for truthy values', () => {
    const result = revertBool({} as Data, 1)
    expect(result).toBe(true)
  })

  it('should return false for falsy values', () => {
    const result = revertBool({} as Data, 0)
    expect(result).toBe(false)
  })

  it('should return false for null', () => {
    const result = revertBool({} as Data, null)
    expect(result).toBe(false)
  })

  it('should return undefined for undefined', () => {
    const result = revertBool({} as Data, undefined)
    expect(result).toBeUndefined()
  })
})
