import type { Data } from '../../types/objectData.js'

function toNumber(val: unknown): number | undefined {
  const result = Number(val)
  return isNaN(result) ? undefined : result
}

export function revertNumber(valueSchema: Data, value: unknown | undefined): number | undefined {
  if (value !== undefined) {
    return toNumber(value)
  }

  if (valueSchema.default === undefined) {
    return undefined
  }

  const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
  return toNumber(defaultValue)
}
