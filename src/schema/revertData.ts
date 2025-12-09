import { revertString } from './revertValues/revertString.js'
import { revertBool } from './revertValues/revertBool.js'
import { revertInteger } from './revertValues/revertInteger.js'
import { revertNumber } from './revertValues/revertNumber.js'
import { revertDate } from './revertValues/revertDate.js'

import type { Row } from '../types/request.js'
import type { Config } from '../types/client.js'
import type { ObjectData, Types, GenericObject } from '../types/objectData.js'

const BASIC_TYPES: Omit<Types, 'object'>[] = ['string', 'number', 'integer', 'boolean', 'array', 'date'] as const

const REVERT_VALUE_FUNCTIONS = {
  string: revertString,
  number: revertNumber,
  integer: revertInteger,
  boolean: revertBool,
  date: revertDate
}

export function revertData(config: Config, data: GenericObject, schema: ObjectData): Row {
  const row: Row = {}
  for (const [key, value] of Object.entries(schema)) {
    let itemKey = key
    if (value.key) {
      itemKey = value.key
    }

    if (BASIC_TYPES.includes(value.type)) {
      if (data[key] === undefined) {
        continue
      }

      const revertValueFunction = REVERT_VALUE_FUNCTIONS[value.type as keyof typeof REVERT_VALUE_FUNCTIONS]
      if (revertValueFunction) {
        row[itemKey as keyof Row] = revertValueFunction(value, data[key]) as Row[keyof Row]
      } else {
        row[itemKey as keyof Row] = data[key] as Row[keyof Row]
      }
    } else if (value.type === 'object' && value.properties && Object.keys(value.properties).length > 0) {
      if (data[key] === undefined) {
        continue
      }

      const subData = revertData(config, data[key] as GenericObject, value.properties)

      // agregar subData al row principal
      for (const [subKey, subValue] of Object.entries(subData)) {
        row[subKey as keyof Row] = subValue as Row[keyof Row]
      }
    }
  }

  return row
}
