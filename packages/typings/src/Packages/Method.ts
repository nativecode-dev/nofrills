import { Type } from './Type'
import { Parameter } from './Parameter'
import { CodeObject } from './CodeObject'

export interface Method extends CodeObject {
  parameters: Parameter[]
  return?: Type
  static?: boolean
}
