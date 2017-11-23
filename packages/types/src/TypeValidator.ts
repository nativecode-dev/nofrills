import { TypeProperties } from './TypeProperties'

export type TypeValidator = (value: any, props?: TypeProperties, ...args: any[]) => boolean
