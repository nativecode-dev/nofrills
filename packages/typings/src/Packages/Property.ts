import { Type } from './Type'

export interface Property {
  name: string
  readonly: boolean
  type: Type
  source?: string
}

export interface Properties {
  [name: string]: Property
}
