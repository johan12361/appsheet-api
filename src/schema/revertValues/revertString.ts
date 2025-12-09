import type { Data } from '../../types/objectData.js'

export function revertString(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
      return String(defaultValue)
    }
    return undefined
  }
  return String(value)
}
