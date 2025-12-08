import type { Data } from '../../types/objectData.js'

export function revertString(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      return String(valueSchema.default)
    }
    return undefined
  }
  return String(value)
}
