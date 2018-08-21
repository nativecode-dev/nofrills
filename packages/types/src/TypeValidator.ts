import { TypeProperties } from './TypeProperties'

export interface TypeValidator {
  (value: any, props?: TypeProperties, ...args: any[]): boolean
}
