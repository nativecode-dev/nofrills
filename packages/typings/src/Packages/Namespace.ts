import { Classes } from './Class'
import { CodeObject } from './CodeObject'
import { Enums } from './Enum'
import { Types } from './Type'

export interface Namespace extends CodeObject {
  classes: Classes
  enums: Enums
  types: Types
}

export interface Namespaces {
  [name: string]: Namespace
}
