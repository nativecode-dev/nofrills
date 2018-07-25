import { Parameter } from './Parameter'
import { CodeObject } from './CodeObject'

export interface Event extends CodeObject {
  parameters: Parameter[]
}
