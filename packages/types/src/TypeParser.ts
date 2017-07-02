import * as validator from 'validator'

import { merge } from 'lodash'

import { Type, TypeProperties } from './Type'
import { Registry } from './TypeRegistry'

export class TypeParser {
  public static deserialize(typestr: string): Type {
    return TypeParser.parse(typestr)
  }

  public static serialize(type: Type): string {
    if (type.properties) {
      const keys: string[] = Object.keys(type.properties)
      const props = type.properties
      const properties: string[] = keys.map<string>((key: string): string => {
        const value: any = props[key]
        return `${key}=${value}`
      })
      return `${type.type}:${properties.join(',')}`
    }
    return type.type
  }

  private static parse(typestr: string): Type {
    const parts: string[] = typestr.split(':')
    const type: Type = Registry.resolve(parts[0])
    if (parts.length === 2) {
      const properties = TypeParser.properties(type, parts[1])
      return merge({}, type, { properties })
    }
    return type
  }

  private static properties(type: Type, properties: string): TypeProperties {
    const props: any = {}
    const setters: string[] = properties.split(',')
    for (const setter of setters) {
      const parts: string[] = setter.split('=')
      const name = parts[0]
      const value = TypeParser.typed(parts[1])
      props[name] = value
    }
    return props as TypeProperties
  }

  private static typed(value: string): any {
    if (validator.isNumeric(value)) {
      return Number(value)
    }
    return value
  }
}
