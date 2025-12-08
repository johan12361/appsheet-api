export type Types = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'date' | 'object'

export interface Data {
  type: Types
  key?: string
  primary?: boolean
  required?: boolean
  default?: unknown
  itemType?: 'string' | 'number' | 'integer' | 'boolean' | 'datetime' // for arrays
  properties?: { [key: string]: Data } // for objects
}

export interface ObjectData {
  [key: string]: Data
}
