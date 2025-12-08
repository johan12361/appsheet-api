import { buildString } from './buildValues/buildString.js'
import { buildBool } from './buildValues/buildBool.js'
import { buildNumber } from './buildValues/buildNumber.js'
import { buildInteger } from './buildValues/buildInteger.js'
import { buildArray } from './buildValues/buildArray.js'
import { buildDate } from './buildValues/buildDate.js'

import type { Config } from '../types/client.js'
import type { ObjectData, Types } from '../types/objectData.js'
import type { AppsheetData } from '../types/request.js'

const BASIC_TYPES: Omit<Types, 'object'>[] = ['string', 'number', 'integer', 'boolean', 'array', 'date'] as const

const BUILD_VALUE_FUNCTIONS = {
  string: buildString,
  number: buildNumber,
  integer: buildInteger,
  boolean: buildBool,
  array: buildArray,
  date: buildDate
}

export function buildData<T>(config: Config, item: AppsheetData, schema: ObjectData): T {
  const data: Partial<T> = {}

  for (const [key, value] of Object.entries(schema)) {
    let itemKey = key
    if (value.key) {
      itemKey = value.key
    }

    if (BASIC_TYPES.includes(value.type)) {
      if (item[itemKey] === undefined) {
        continue
      }

      const rawValue = getStringValue(item[itemKey])

      const buildValueFunction = BUILD_VALUE_FUNCTIONS[value.type as keyof typeof BUILD_VALUE_FUNCTIONS]
      if (buildValueFunction) {
        data[key as keyof T] = buildValueFunction(value, rawValue, config) as T[keyof T]
      } else {
        data[key as keyof T] = rawValue as T[keyof T]
      }
    }
    // process nested objects
    else if (value.type === 'object' && value.properties && Object.keys(value.properties).length > 0) {
      const subData = buildData<T>(config, item, value.properties)
      data[key as keyof T] = subData as T[keyof T]
    }
  }

  return data as T
}

function getStringValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value.includes('Url') && value.includes('LinkText')) {
    const jsonValue = JSON.parse(value)
    value = jsonValue.Url as string
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return undefined
    }
    return value
  }

  if (value === undefined || value === null) {
    return undefined
  }

  // otro tipo de valor
  return String(value)
}
