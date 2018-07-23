export interface Enum {
  name: string
  mappings: {
    [name: string]: any
  }
  source?: string
}

export interface Enums {
  [name: string]: Enum
}
