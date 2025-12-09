import type { Data } from '../../types/objectData.js'

export function revertString(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value !== undefined) {
    return String(value)
  }

  if (valueSchema.default === undefined) {
    return undefined
  }

  const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
  return String(defaultValue)
}
