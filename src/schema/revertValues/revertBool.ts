import type { Data } from '../../types/objectData.js'

export function revertBool(valueSchema: Data, value: unknown | undefined): boolean | undefined {
  if (value !== undefined) {
    return Boolean(value)
  }

  if (valueSchema.default === undefined) {
    return undefined
  }

  const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
  return Boolean(defaultValue)
}
