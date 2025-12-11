import { describe, it, expect } from 'vitest'
import { buildBool } from '../../../schema/buildValues/buildBool.js'
import type { Data } from '../../../types/objectData.js'

describe('buildBool', () => {
  it('should return undefined for undefined input', () => {
    const result = buildBool({} as Data, undefined)
    expect(result).toBeUndefined()
  })

  it('should return true for "true" string', () => {
    const result = buildBool({} as Data, 'true')
    expect(result).toBe(true)
  })

  it('should return true for "True" string (case insensitive)', () => {
    const result = buildBool({} as Data, 'True')
    expect(result).toBe(true)
  })

  it('should return true for "TRUE" string', () => {
    const result = buildBool({} as Data, 'TRUE')
    expect(result).toBe(true)
  })

  it('should return false for "false" string', () => {
    const result = buildBool({} as Data, 'false')
    expect(result).toBe(false)
  })

  it('should return false for any other string', () => {
    const result = buildBool({} as Data, 'anything else')
    expect(result).toBe(false)
  })

  it('should return false for empty string', () => {
    const result = buildBool({} as Data, '')
    expect(result).toBe(false)
  })
})
