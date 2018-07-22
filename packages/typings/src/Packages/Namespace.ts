import { Class } from './Class'
import { Enum } from './Enum'
import { Type } from './Type'

export interface Namespace {
  name: string
  classes: Class[]
  enums: Enum[]
  types: Type[]
}
