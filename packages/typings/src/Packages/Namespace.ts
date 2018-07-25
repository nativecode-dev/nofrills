import { Class } from './Class'
import { CodeObject } from './CodeObject'
import { Enum } from './Enum'
import { Types } from './Type'

export interface Namespace extends CodeObject {
  classes: Class[]
  enums: Enum[]
  types: Types
}
