import type { Data } from '../../types/objectData.js'

export function revertInteger(valueSchema: Data, value: unknown | undefined): number | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
      const revert = parseInt(String(defaultValue), 10)
      return isNaN(revert) ? undefined : revert
    }
    return undefined
  }
  const result = parseInt(String(value), 10)
  return isNaN(result) ? undefined : result
}
