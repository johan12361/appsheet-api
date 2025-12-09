import { describe, it, expect } from 'vitest'
import { buildNumber } from '../../../schema/buildValues/buildNumber.js'
import type { Data } from '../../../types/objectData.js'

describe('buildNumber', () => {
  it('should return undefined for undefined input', () => {
    const result = buildNumber({} as Data, undefined)
    expect(result).toBeUndefined()
  })

  it('should parse valid number string', () => {
    const result = buildNumber({} as Data, '42.5')
    expect(result).toBe(42.5)
  })

  it('should parse negative number', () => {
    const result = buildNumber({} as Data, '-10.25')
    expect(result).toBe(-10.25)
  })

  it('should return undefined for invalid number', () => {
    const result = buildNumber({} as Data, 'not a number')
    expect(result).toBeUndefined()
  })

  it('should parse zero', () => {
    const result = buildNumber({} as Data, '0')
    expect(result).toBe(0)
  })
})
