import { CodeObject } from './CodeObject'

export interface Type extends CodeObject {
  basetypes: string[]
}

export interface Types {
  [name: string]: Type
}
