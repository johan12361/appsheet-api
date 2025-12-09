import type { Data } from '../../types/objectData.js'

const TRUE_VALUES = ['true', '1', 'yes', 'on', 'y']

export function buildBool(_valueSchema: Data, value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined
  }

  return TRUE_VALUES.includes(value.toLowerCase())
}
