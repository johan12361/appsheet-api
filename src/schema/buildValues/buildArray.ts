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

function processItem(item: string, valueSchema: Data, config: Config): unknown | undefined {
  const buildValueFunction = HANDLED[valueSchema.itemType as keyof typeof HANDLED]

  if (buildValueFunction) {
    return buildValueFunction(valueSchema, item.trim(), config)
  }

  return undefined
}

export function buildArray(valueSchema: Data, value: string | undefined, config: Config): unknown[] | undefined {
  if (value === undefined) {
    return Array.isArray(valueSchema.default) ? valueSchema.default : []
  }

  const items = value
    .split(' , ')
    .map((item) => processItem(item, valueSchema, config))
    .filter((v) => v !== undefined)

  return items
}
