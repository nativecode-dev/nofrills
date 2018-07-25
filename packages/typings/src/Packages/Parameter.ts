import { CodeObject } from './CodeObject'
import { Type } from './Type'

export interface Parameter extends CodeObject {
  default?: string
  required?: boolean
  type: Type
}

export class Parameters {
  [name: string]: Parameter
}
