import { describe, it, expect } from 'vitest'
import { buildString } from '../../../schema/buildValues/buildString'

describe('buildString', () => {
  it('should return empty string for empty input', () => {
    const result = buildString({} as any, '', {} as any)
    expect(result).toBe('')
  })

  it('should return whitespace string as-is', () => {
    const result = buildString({} as any, '   ', {} as any)
    expect(result).toBe('   ')
  })

  it('should return string with spaces as-is', () => {
    const result = buildString({} as any, '  hello world  ', {} as any)
    expect(result).toBe('  hello world  ')
  })

  it('should return string as-is if already trimmed', () => {
    const result = buildString({} as any, 'hello', {} as any)
    expect(result).toBe('hello')
  })

  it('should return undefined for undefined input', () => {
    const result = buildString({} as any, undefined, {} as any)
    expect(result).toBeUndefined()
  })
})
