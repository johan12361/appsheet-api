import type { Data } from '../../types/objectData.js'

export function revertDate(valueSchema: Data, value: unknown | undefined): string | undefined {
  if (value === undefined) {
    if (valueSchema.default !== undefined) {
      if (valueSchema.default instanceof Date) {
        return buildDateString(valueSchema.default)
      } else if (typeof valueSchema.default === 'string') {
        return valueSchema.default
      }
      return undefined
    }
    return undefined
  }

  if (value instanceof Date) {
    return buildDateString(value)
  }

  if (typeof value === 'string') {
    return value
  }

  return undefined
}

// convert to YYYY-MM-DD HH:mm:ss format
function buildDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
