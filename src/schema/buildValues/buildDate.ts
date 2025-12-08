import { DateTime } from 'luxon'

import type { Config } from '../../types/client.js'
import type { Data } from '../../types/objectData.js'

export function buildDate(dataSchema: Data, value: string | undefined, config: Config): Date | undefined {
  if (value === undefined) {
    return undefined
  }

  // esperar formato MM/DD/YYYY HH:MM:SS o solo MM/DD/YYYY
  const tz = config.timezone || 'UTC'
  const dt = parseDateWithTZ(value, tz)

  if (dt) {
    const jsDate = dt.toJSDate()
    return jsDate
  }

  return undefined
}

function parseDateWithTZ(input: string, tz: string): DateTime | null {
  const formats = [
    'MM/dd/yyyy HH:mm:ss',
    'MM/dd/yyyy HH:mm',
    'MM/dd/yyyy' // sin hora
  ]

  for (const fmt of formats) {
    const dt = DateTime.fromFormat(input, fmt, { zone: tz })

    if (dt.isValid) {
      return dt
    }
  }

  return null
}
