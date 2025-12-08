import { buildBool } from './buildBool.js'
import { buildInteger } from './buildInteger.js'
import { buildNumber } from './buildNumber.js'
import { buildString } from './buildString.js'
import { buildDate } from './buildDate.js'

const HANDLED = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  boolean: buildBool,
  date: buildDate
}

import type { Config } from '../../types/client.js'
import type { Data } from '../../types/objectData.js'

export function buildArray(dataSchema: Data, value: string | undefined, config: Config): unknown[] | undefined {
  if (value === undefined) {
    if (dataSchema.default !== undefined) {
      return Array.isArray(dataSchema.default) ? dataSchema.default : []
    }
    return []
  }

  // dividir el string por comas y limpiar espacios
  const items = value
    .split(' , ')
    .map((item) => {
      // limpiar espacios
      const cleanItem = item.trim()

      // construir el valor según el tipo de item
      const buildValueFunction = HANDLED[dataSchema.itemType as keyof typeof HANDLED]
      if (buildValueFunction) {
        const builtValue = buildValueFunction(dataSchema, cleanItem, config)
        if (builtValue !== undefined) {
          return builtValue
        }
      }
      return undefined
    })
    .filter((v) => v !== undefined)

  return items
}
