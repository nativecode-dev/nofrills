import { Is } from './Is'
import { Registry } from './Registry'
import { Type } from './Type'
import { TypeParser } from './TypeParser'
import { TypeProperties } from './TypeProperties'

const Any: Type = {
  default: undefined,
  properties: {},
  type: 'any',
  typebase: 'object',
  validator: (value: any) => true,
}

const BaseTypes: string[] = ['Array', 'Boolean', 'Date', 'Error', 'Number', 'Object', 'String']

export class TypeRegistry {
  private readonly registry: Map<string, Type>

  constructor() {
    this.registry = new Map<string, Type>()
  }

  public from(value: any): string {
    const keys: string[] = Object.keys(Is)
    for (const key of keys) {
      const func = Is[key]
      if (key !== 'any' && func(value)) {
        return key
      }
    }

    // We won't ever hit this because we can't create something
    // that isn't a type of something to test.
    /* istanbul ignore next */
    throw new TypeError(`Could not parse for type: ${value}.`)
  }

  public register(type: Partial<Type>): TypeRegistry {
    const baseType: Type = this.resolve(type.typebase || 'any')
    const merged: Type = Object.assign({}, baseType, type)
    this.registry.set(merged.type, merged)
    return this
  }

  public resolve(name: string): Type {
    const type = this.registry.get(name)
    if (type) {
      return type
    }
    return Any
  }

  public validate(value: any, type: string): boolean {
    const typedef = Registry.resolve(type)
    return typedef.validator(value, typedef.properties)
  }
}
