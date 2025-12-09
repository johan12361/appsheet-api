import type { Data } from '../../types/objectData.js'

export function revertNumber(valueSchema: Data, value: unknown | undefined): number | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
      const result = Number(defaultValue)
      return isNaN(result) ? undefined : result
    }
    return undefined
  }
  const result = Number(value)
  return isNaN(result) ? undefined : result
}
