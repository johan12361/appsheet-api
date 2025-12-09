import type { Data } from '../../types/objectData.js'

function toInteger(val: unknown): number | undefined {
  const result = parseInt(String(val), 10)
  return isNaN(result) ? undefined : result
}

export function revertInteger(valueSchema: Data, value: unknown | undefined): number | undefined {
  if (value !== undefined) {
    return toInteger(value)
  }

  if (valueSchema.default === undefined) {
    return undefined
  }

  const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
  return toInteger(defaultValue)
}
