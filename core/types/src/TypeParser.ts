import merge from 'deepmerge'
import validator from 'validator'

import { Type } from './Type'
import { TypeProperties } from './TypeProperties'
import { Types } from './Types'

export class TypeParser {
  static deserialize(typestr: string): Type {
    return TypeParser.parse(typestr)
  }

  static serialize(type: Partial<Type>, full: boolean = false): string {
    const typedef: Type = TypeParser.materialize(type)
    const keys: string[] = Object.keys(typedef.properties)
    const props = typedef.properties

    if (keys.length === 0) {
      return typedef.type
    }

    if (typedef.default && full === false) {
      return `${typedef.type}:${props[typedef.default]}`
    } else if (typedef.default === undefined && full === false) {
      return typedef.type
    }

    const properties: string[] = keys.map<string>((key: string): string => {
      const value: any = props[key]
      return `${key}=${value}`
    })

    return `${typedef.type}:${properties.join(',')}`
  }

  private static materialize(type: Partial<Type>): Type {
    const typedef: Type = Types.resolve(type.typebase || 'any')
    return merge.all([typedef, type]) as Type
  }

  private static parse(typestr: string): Type {
    const parts: string[] = typestr.split(':')
    const type: Type = Types.resolve(parts[0])
    if (parts.length === 2) {
      const properties = { properties: TypeParser.properties(type, parts[1]) }
      return { ...type, ...properties }
    }
    return type
  }

  private static properties(type: Type, properties: string): TypeProperties {
    const props: any = {}
    const setters: string[] = properties.split(',')
    for (const setter of setters) {
      const parts: string[] = setter.split('=')
      const name = parts[0]
      if (parts.length === 1 && type.default) {
        props[type.default] = TypeParser.typed(parts[0])
      } else {
        const value = TypeParser.typed(parts[1])
        props[name] = value
      }
    }
    return props as TypeProperties
  }

  private static typed(value: string): any {
    if (validator.isBoolean(value)) {
      return Boolean(value)
    }

    if (validator.isNumeric(value)) {
      return Number(value)
    }

    throw new TypeError(`${value} is not a supported deserialization type.`)
  }
}
