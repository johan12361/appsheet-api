import type { Data } from '../../types/objectData.js'

export function buildNumber(valueSchema: Data, value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }

  const numValue = Number(value)
  if (isNaN(numValue)) {
    return undefined
  }
  return numValue
}
