import { revertString } from './revertValues/revertString.js'
import { revertBool } from './revertValues/revertBool.js'
import { revertInteger } from './revertValues/revertInteger.js'
import { revertNumber } from './revertValues/revertNumber.js'
import { revertDate } from './revertValues/revertDate.js'
import { revertArray } from './revertValues/revertArray.js'

import type { Row } from '../types/request.js'
import type { Config } from '../types/client.js'
import type { ObjectData, Types } from '../types/objectData.js'

const BASIC_TYPES: Omit<Types, 'object'>[] = ['string', 'number', 'integer', 'boolean', 'array', 'date'] as const

const REVERT_VALUE_FUNCTIONS = {
  string: revertString,
  number: revertNumber,
  integer: revertInteger,
  boolean: revertBool,
  array: revertArray,
  date: revertDate
}

export function revertData(config: Config, data: Record<string, unknown>, schema: ObjectData): Row {
  const row: Row = {}

  for (const [key, value] of Object.entries(schema)) {
    const itemKey = value.key ?? key
    const fieldValue = data[key]
    const hasValue = fieldValue !== undefined
    const hasDefault = value.default !== undefined

    if (!hasValue && !hasDefault) {
      continue
    }

    if (BASIC_TYPES.includes(value.type)) {
      const revertValueFunction = REVERT_VALUE_FUNCTIONS[value.type as keyof typeof REVERT_VALUE_FUNCTIONS]

      if (revertValueFunction) {
        const revertedValue = revertValueFunction(value, fieldValue)

        if (revertedValue !== undefined) {
          row[itemKey as keyof Row] = revertedValue as Row[keyof Row]
        }
      } else if (hasValue) {
        row[itemKey as keyof Row] = fieldValue as Row[keyof Row]
      }
    } else if (value.type === 'object' && value.properties && Object.keys(value.properties).length > 0) {
      if (!hasValue) {
        continue
      }

      const subData = revertData(config, fieldValue as Record<string, unknown>, value.properties)

      Object.assign(row, subData)
    }
  }

  return row
}
