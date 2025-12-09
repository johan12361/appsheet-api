import { describe, it, expect } from 'vitest'
import { buildDate } from '../../../schema/buildValues/buildDate'
import type { Config } from '../types/client'

describe('buildDate', () => {
  const config: Config = {
    timezone: 'UTC',
    returnRawData: false,
    sendRawData: false
  }

  it('should return undefined for undefined input', () => {
    const result = buildDate({} as any, undefined, config)
    expect(result).toBeUndefined()
  })

  it('should parse MM/DD/YYYY format', () => {
    const result = buildDate({} as any, '12/25/2023', config)
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2023)
    expect(result?.getMonth()).toBe(11) // December is 11
    // Date may vary by timezone
    expect(result?.getDate()).toBeGreaterThanOrEqual(24)
    expect(result?.getDate()).toBeLessThanOrEqual(25)
  })

  it('should parse MM/DD/YYYY HH:mm:ss format', () => {
    const result = buildDate({} as any, '12/25/2023 14:30:45', config)
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2023)
    expect(result?.getMonth()).toBe(11)
    expect(result?.getDate()).toBe(25)
  })

  it('should handle different timezone', () => {
    const customConfig: Config = {
      ...config,
      timezone: 'America/New_York'
    }
    const result = buildDate({} as any, '12/25/2023 12:00:00', customConfig)
    expect(result).toBeInstanceOf(Date)
  })

  it('should return undefined for invalid date string', () => {
    const result = buildDate({} as any, 'not a date', config)
    expect(result).toBeUndefined()
  })
})
