import type { Data } from '../../types/objectData.js'

export function revertBool(valueSchema: Data, value: unknown | undefined): boolean | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      return Boolean(valueSchema.default)
    }
    return undefined
  }
  return Boolean(value)
}
