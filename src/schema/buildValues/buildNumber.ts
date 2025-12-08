import type { Data } from '../../types/objectData.js'

export function buildNumber(dataSchema: Data, value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }

  const intValue = Number(value)
  if (isNaN(intValue)) {
    return undefined
  }
  return intValue
}
