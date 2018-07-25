import { CodeObject } from './CodeObject'
import { Parameters } from './Parameter'
import { Type } from './Type'

export interface Method extends CodeObject {
  parameters: Parameters
  return?: Type
}

export interface Methods {
  [name: string]: Method
}
