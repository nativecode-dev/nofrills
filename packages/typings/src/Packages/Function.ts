import { Type } from './Type'
import { Parameters } from './Parameter'
import { CodeObject } from './CodeObject'

export interface Function extends CodeObject {
  parameters: Parameters
  return?: Type
}

export interface Functions {
  [key: string]: Function
}
