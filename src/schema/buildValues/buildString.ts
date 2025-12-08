import type { Data } from '../../types/objectData.js'

export function buildString(valueSchema: Data, value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }
  return value
}
