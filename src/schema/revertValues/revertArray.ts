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

export function revertArray(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined && Array.isArray(valueSchema.default)) {
      return valueSchema.default.join(' , ')
    }
    return undefined
  }
  if (Array.isArray(value)) {
    const items = value
      .map((item) => {
        const revertValueFunction = HANDLED[valueSchema.itemType as keyof typeof HANDLED]
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
  return undefined
}
