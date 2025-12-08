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
  // recorrer el esquema de datos
  for (const [key, value] of Object.entries(schema)) {
    let itemKey = key
    // renombrar key si es necesario
    if (value.key) {
      itemKey = value.key
    }

    // procesar solo tipos básicos
    if (BASIC_TYPES.includes(value.type)) {
      // validar si la key existe en el item
      if (data[itemKey] === undefined) {
        continue
      }

      // revertir valor según tipo
      const revertValueFunction = REVERT_VALUE_FUNCTIONS[value.type as keyof typeof REVERT_VALUE_FUNCTIONS]
      if (revertValueFunction) {
        // construir valor usando la función correspondiente
        row[itemKey as keyof Row] = revertValueFunction(value, data[itemKey]) as Row[keyof Row]
      } else {
        // asignar valor directamente
        row[itemKey as keyof Row] = data[itemKey] as Row[keyof Row]
      }
    }
    // procesar objetos anidados
    else if (value.type === 'object' && value.properties && Object.keys(value.properties).length > 0) {
      // validar si el objeto existe en los datos
      if (data[itemKey] === undefined) {
        continue
      }

      const subData = revertData(config, data[itemKey] as GenericObject, value.properties)

      // agregar subData al row principal
      for (const [subKey, subValue] of Object.entries(subData)) {
        row[subKey as keyof Row] = subValue as Row[keyof Row]
      }
    }
  }

  return row
}
