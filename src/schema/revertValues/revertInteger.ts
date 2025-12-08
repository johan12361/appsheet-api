import type { Data } from '../../types/objectData.js'

export function revertInteger(valueSchema: Data, value: unknown | undefined): number | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      const revert = parseInt(String(valueSchema.default), 10)
      return isNaN(revert) ? undefined : revert
    }
    return undefined
  }
  const result = parseInt(String(value), 10)
  return isNaN(result) ? undefined : result
}
