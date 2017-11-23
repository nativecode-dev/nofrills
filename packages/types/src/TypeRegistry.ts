import { Is } from './Is'
import { Type } from './Type'

const Any: Type = {
  default: undefined,
  properties: {},
  type: 'any',
  typebase: 'object',
  validator: (value: any) => true,
}

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
    const typedef = this.resolve(type)
    return typedef.validator(value, typedef.properties)
  }
}
