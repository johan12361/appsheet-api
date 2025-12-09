import { describe, it, expect } from 'vitest'
import { revertDate } from '../../../schema/revertValues/revertDate'
import type { Config } from '../types/client'

describe('revertDate', () => {
  const config: Config = {
    timezone: 'UTC',
    returnRawData: false,
    sendRawData: false
  }

  it('should format date to YYYY-MM-DD HH:mm:ss', () => {
    const date = new Date('2023-12-25T14:30:45Z')
    const result = revertDate({} as any, date)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('should handle single digit months and days', () => {
    const date = new Date('2023-01-05T08:05:03Z')
    const result = revertDate({} as any, date)
    expect(result).toContain('2023-01-05')
  })

  it('should handle midnight', () => {
    const date = new Date('2023-12-25T00:00:00Z')
    const result = revertDate({} as any, date)
    // revertDate uses local time, not UTC
    expect(result).toBeTruthy()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('should handle end of day', () => {
    const date = new Date('2023-12-25T23:59:59Z')
    const result = revertDate({} as any, date)
    expect(result).toBeTruthy()
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('should handle Date object properly', () => {
    const date = new Date(2023, 11, 25, 14, 30, 45) // December 25, 2023
    const result = revertDate({} as any, date)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})
