import { CodeObject } from './CodeObject'
import { Type } from './Type'

export interface Property extends CodeObject {
  readonly?: boolean
  type: Type
}
