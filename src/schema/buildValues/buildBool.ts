import type { Data } from '../../types/objectData.js'

const trueValues = ['true', '1', 'yes', 'on', 'y']

export function buildBool(dataSchema: Data, value: string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined
  }

  // convertir string a boolean
  const cleanValue = value.toLowerCase()

  // Verificar si el valor está en la lista de valores verdaderos
  return trueValues.includes(cleanValue)
}
