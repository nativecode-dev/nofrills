import { Classes } from './Class'
import { Enums } from './Enum'
import { Types } from './Type'

export interface Namespace {
  name: string
  classes: Classes
  enums: Enums
  types: Types
  source?: string
}

export interface Namespaces {
  [name: string]: Namespace
}
