import { revertString } from './revertString.js'
import { revertDate } from './revertDate.js'
import { revertInteger } from './revertInteger.js'
import { revertNumber } from './revertNumber.js'

import type { Data } from '../../types/objectData.js'

const HANDLED = {
  string: revertString,
  number: revertNumber,
  integer: revertInteger,
  date: revertDate
}

function processArrayToString(arr: unknown[], valueSchema: Data): string {
  const revertValueFunction = HANDLED[valueSchema.itemType as keyof typeof HANDLED]

  const items = arr
    .map((item) => {
      if (revertValueFunction) {
        const revertedValue = revertValueFunction(valueSchema, item)
        if (revertedValue !== undefined) {
          return String(revertedValue)
        }
      }
      return String(item)
    })
    .filter((v) => v !== undefined && v !== 'undefined')

  return items.join(' , ')
}

export function revertArray(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value !== undefined && Array.isArray(value)) {
    return processArrayToString(value, valueSchema)
  }

  if (valueSchema.default === undefined) {
    return undefined
  }

  const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default

  if (Array.isArray(defaultValue)) {
    return defaultValue.join(' , ')
  }

  return undefined
}
