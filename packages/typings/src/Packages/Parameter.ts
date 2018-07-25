import { CodeObject } from './CodeObject'
import { Type } from './Type'

export interface Parameter extends CodeObject {
  default?: string
  optional?: boolean
  type: Type
}
