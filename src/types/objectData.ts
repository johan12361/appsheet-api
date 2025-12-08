export type Types = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'date' | 'object'

export interface Data {
  type: Types
  key?: string
  primary?: boolean
  default?: unknown
  itemType?: 'string' | 'number' | 'integer' | 'datetime' // for arrays
  properties?: { [key: string]: Data } // for objects
}

export interface ObjectData {
  [key: string]: Data
}

export type GenericObject = { [key: string]: unknown }
