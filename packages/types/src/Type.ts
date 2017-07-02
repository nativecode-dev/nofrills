export interface Type {
  properties?: TypeProperties,
  type: string
  typebase: string
  validator: TypeValidator
}

export interface TypeProperties {
  max?: number
  min?: number
  nullable?: boolean
  regex?: RegExp
}

export type TypeValidator = (value: any, ...args: any[]) => boolean
