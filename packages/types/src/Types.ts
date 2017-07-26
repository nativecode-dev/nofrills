export interface Type {
  default: string | undefined
  properties: TypeProperties
  type: string
  typebase: string
  validator: TypeValidator
}

export interface TypeProperties {
  [key: string]: any
  max?: number
  min?: number
  required?: boolean
}

export type TypeValidator = (value: any, ...args: any[]) => boolean
