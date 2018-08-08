import { Parameter } from './Parameter'
import { CodeObject } from './CodeObject'

export interface Event extends CodeObject {
  parameters: Parameter[]
}

export interface Events {
  [key: string]: Event
}
