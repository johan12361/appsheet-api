export type Row = Record<string, string>

export interface Properties {
  Selector?: string
  UserSettings?: Record<string, string>
}

// formato transformado de los datos desde Appsheet
export type AppsheetData = {
  [key: string]: string | undefined
}
