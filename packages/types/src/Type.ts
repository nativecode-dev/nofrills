import { TypeProperties } from './TypeProperties'
import { TypeValidator } from './TypeValidator'

export interface Type {
  default: string | undefined
  properties: TypeProperties
  type: string
  typebase: string
  validator: TypeValidator
}
