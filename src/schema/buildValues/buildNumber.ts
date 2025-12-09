import type { Data } from '../../types/objectData.js'

export function buildNumber(_valueSchema: Data, value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }

  const numValue = Number(value)
  return isNaN(numValue) ? undefined : numValue
}
