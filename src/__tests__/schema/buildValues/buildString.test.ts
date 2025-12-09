import { describe, it, expect } from 'vitest'
import { buildString } from '../../../schema/buildValues/buildString.js'
import type { Data } from '../../../types/objectData.js'

describe('buildString', () => {
  it('should return empty string for empty input', () => {
    const result = buildString({} as Data, '')
    expect(result).toBe('')
  })

  it('should return whitespace string as-is', () => {
    const result = buildString({} as Data, '   ')
    expect(result).toBe('   ')
  })

  it('should return string with spaces as-is', () => {
    const result = buildString({} as Data, '  hello world  ')
    expect(result).toBe('  hello world  ')
  })

  it('should return string as-is if already trimmed', () => {
    const result = buildString({} as Data, 'hello')
    expect(result).toBe('hello')
  })

  it('should return undefined for undefined input', () => {
    const result = buildString({} as Data, undefined)
    expect(result).toBeUndefined()
  })
})
