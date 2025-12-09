import type { Data } from '../../types/objectData.js'

export function buildInteger(_valueSchema: Data, value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined
  }

  const intValue = parseInt(value, 10)
  return isNaN(intValue) ? undefined : intValue
}
