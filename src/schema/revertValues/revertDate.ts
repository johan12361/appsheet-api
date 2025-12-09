import type { Data } from '../../types/objectData.js'

function buildDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function convertToDateString(val: unknown): string | undefined {
  if (val instanceof Date) {
    return buildDateString(val)
  }
  if (typeof val === 'string') {
    return val
  }
  return undefined
}

export function revertDate(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value !== undefined) {
    return convertToDateString(value)
  }

  if (valueSchema.default === undefined) {
    return undefined
  }

  const defaultValue = typeof valueSchema.default === 'function' ? valueSchema.default() : valueSchema.default
  return convertToDateString(defaultValue)
}
