export interface IsType {
  [name: string]: (value: any, type?: string) => boolean

  any: (value: any, type?: string) => boolean
  array: (value: any, type?: string) => boolean
  arrayOf: (value: any, type?: string) => boolean
  boolean: (value: any, type?: string) => boolean
  date: (value: any, type?: string) => boolean
  error: (value: any, type?: string) => boolean
  function: (value: any, type?: string) => boolean
  number: (value: any, type?: string) => boolean
  object: (value: any, type?: string) => boolean
  string: (value: any, type?: string) => boolean
}
