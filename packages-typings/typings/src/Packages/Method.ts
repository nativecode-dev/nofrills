import { Type } from './Type'
import { Parameters } from './Parameter'
import { CodeObject } from './CodeObject'

export interface Method extends CodeObject {
  parameters: Parameters
  return?: Type
  static?: boolean
}

export interface Methods {
  [key: string]: Method
}
