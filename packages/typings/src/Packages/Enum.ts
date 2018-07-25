import { CodeObject } from './CodeObject'

export interface Enum extends CodeObject {
  mappings: {
    [name: string]: any
  }
}

export interface Enums {
  [name: string]: Enum
}
