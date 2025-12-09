import { DateTime } from 'luxon'

import type { Config } from '../../types/client.js'
import type { Data } from '../../types/objectData.js'

const DATE_FORMATS = ['MM/dd/yyyy HH:mm:ss', 'MM/dd/yyyy HH:mm', 'MM/dd/yyyy']

function parseDate(input: string, timezone: string): DateTime | null {
  for (const format of DATE_FORMATS) {
    const dt = DateTime.fromFormat(input, format, { zone: timezone })
    if (dt.isValid) {
      return dt
    }
  }
  return null
}

export function buildDate(_valueSchema: Data, value: string | undefined, config: Config): Date | undefined {
  if (value === undefined) {
    return undefined
  }

  const timezone = config.timezone ?? 'UTC'
  const dt = parseDate(value, timezone)

  return dt?.toJSDate()
}
