import { Registry as RegistryType } from '@nofrills/collections'

import { Is } from './Is'
import { TypeParser } from './TypeParser'
import { Type, TypeProperties } from './Types'

const Any: Type = {
  type: 'any',
  typebase: 'object',
  validator: (value: any) => true
}

const BaseTypes: string[] = ['Array', 'Boolean', 'Date', 'Error', 'Number', 'Object', 'String']

export class TypeRegistry {
  private readonly registry: RegistryType<Type>

  constructor() {
    this.registry = new RegistryType<Type>()
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

  public register(type: Type): TypeRegistry {
    this.registry.register(type.type, type)
    return this
  }

  public resolve(name: string): Type {
    const type = this.registry.resolve(name)
    if (type) {
      return type
    }
    return Any
  }

  public validate(value: any, type: string): boolean {
    const typedef = Types.resolve(type)
    return typedef.validator(value, typedef.properties)
  }
}

export const Types: TypeRegistry = new TypeRegistry()
