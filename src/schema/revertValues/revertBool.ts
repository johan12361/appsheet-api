import type { Data } from '../../types/objectData.js'

export function revertBool(valueSchema: Data, value: unknown | undefined): boolean | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
      return Boolean(defaultValue)
    }
    return undefined
  }
  return Boolean(value)
}
