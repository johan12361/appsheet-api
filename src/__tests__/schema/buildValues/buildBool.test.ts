import { describe, it, expect } from 'vitest'
import { buildBool } from '../../../schema/buildValues/buildBool'

describe('buildBool', () => {
  it('should return undefined for undefined input', () => {
    const result = buildBool({} as any, undefined, {} as any)
    expect(result).toBeUndefined()
  })

  it('should return true for "true" string', () => {
    const result = buildBool({} as any, 'true', {} as any)
    expect(result).toBe(true)
  })

  it('should return true for "True" string (case insensitive)', () => {
    const result = buildBool({} as any, 'True', {} as any)
    expect(result).toBe(true)
  })

  it('should return true for "TRUE" string', () => {
    const result = buildBool({} as any, 'TRUE', {} as any)
    expect(result).toBe(true)
  })

  it('should return false for "false" string', () => {
    const result = buildBool({} as any, 'false', {} as any)
    expect(result).toBe(false)
  })

  it('should return false for any other string', () => {
    const result = buildBool({} as any, 'anything else', {} as any)
    expect(result).toBe(false)
  })

  it('should return false for empty string', () => {
    const result = buildBool({} as any, '', {} as any)
    expect(result).toBe(false)
  })
})
