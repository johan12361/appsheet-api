import { buildInteger } from './buildInteger.js'
import { buildNumber } from './buildNumber.js'
import { buildString } from './buildString.js'
import { buildDate } from './buildDate.js'

import type { Config } from '../../types/client.js'
import type { Data } from '../../types/objectData.js'

const HANDLED = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  date: buildDate
}

export function buildArray(valueSchema: Data, value: string | undefined, config: Config): unknown[] | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      return Array.isArray(valueSchema.default) ? valueSchema.default : []
    }
    return []
  }

  const items = value
    .split(' , ')
    .map((item) => {
      const cleanItem = item.trim()

      const buildValueFunction = HANDLED[valueSchema.itemType as keyof typeof HANDLED]
      if (buildValueFunction) {
        const builtValue = buildValueFunction(valueSchema, cleanItem, config)
        if (builtValue !== undefined) {
          return builtValue
        }
      }
      return undefined
    })
    .filter((v) => v !== undefined)

  return items
}
