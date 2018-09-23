import { Classes } from './Class'
import { CodeObject } from './CodeObject'
import { Enums } from './Enum'
import { Functions } from './Function'
import { Types } from './Type'

export interface Namespace extends CodeObject {
  classes: Classes
  enums: Enums
  functions: Functions
  types: Types
}

export interface Namespaces {
  [key: string]: Namespace
}
