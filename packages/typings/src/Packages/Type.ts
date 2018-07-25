import { CodeObject } from './CodeObject'

export interface Type extends CodeObject {
  external: boolean
  reference?: any
}

export interface Types {
  [name: string]: Type
}
