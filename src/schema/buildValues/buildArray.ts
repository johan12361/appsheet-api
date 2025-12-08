import { buildBool } from './buildBool.js'
import { buildInteger } from './buildInteger.js'
import { buildNumber } from './buildNumber.js'
import { buildString } from './buildString.js'

const HANDLED = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  boolean: buildBool
}

import type { Data } from '../../types/objectData.js'

export function buildArray(dataSchema: Data, value: string | undefined): unknown[] | undefined {
  if (value === undefined) {
    if (dataSchema.default !== undefined) {
      return Array.isArray(dataSchema.default) ? dataSchema.default : undefined
    }
    return undefined
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
        const builtValue = buildValueFunction(dataSchema, cleanItem)
        if (builtValue !== undefined) {
          return builtValue
        }
      }
      return undefined
    })
    .filter((v) => v !== undefined)

  return items
}
