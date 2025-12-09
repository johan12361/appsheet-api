import type { Data } from '../../types/objectData.js'

const trueValues = ['true', '1', 'yes', 'on', 'y']

export function buildBool(valueSchema: Data, value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined
  }

  const cleanValue = value.toLowerCase()
  return trueValues.includes(cleanValue)
}
