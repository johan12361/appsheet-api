import { describe, it, expect } from 'vitest'
import { buildNumber } from '../../../schema/buildValues/buildNumber.js'

describe('buildNumber', () => {
  it('should return undefined for undefined input', () => {
    const result = buildNumber({} as any, undefined, {} as any)
    expect(result).toBeUndefined()
  })

  it('should parse valid number string', () => {
    const result = buildNumber({} as any, '42.5', {} as any)
    expect(result).toBe(42.5)
  })

  it('should parse negative number', () => {
    const result = buildNumber({} as any, '-10.25', {} as any)
    expect(result).toBe(-10.25)
  })

  it('should return undefined for invalid number', () => {
    const result = buildNumber({} as any, 'not a number', {} as any)
    expect(result).toBeUndefined()
  })

  it('should parse zero', () => {
    const result = buildNumber({} as any, '0', {} as any)
    expect(result).toBe(0)
  })
})
