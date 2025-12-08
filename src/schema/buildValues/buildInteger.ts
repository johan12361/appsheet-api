import type { Data } from '../../types/objectData.js'

export function buildInteger(valueSchema: Data, value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }
  const intValue = parseInt(value, 10)
  if (isNaN(intValue)) {
    return undefined
  }
  return intValue
}
