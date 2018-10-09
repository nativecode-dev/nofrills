import * as merge from 'deepmerge'

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

  from(value: any): string {
    if (value === undefined) {
      return 'undefined'
    }

    if (value === null) {
      return 'null'
    }

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

  register(type: Partial<Type>): TypeRegistry {
    const baseType: Type = this.resolve(type.typebase || 'any')
    const merged: Type = merge.all([baseType, type]) as Type
    this.registry.set(merged.type, merged)
    return this
  }

  resolve(name: string): Type {
    const type = this.registry.get(name)
    return type ? type : Any
  }

  validate(value: any, type: string): boolean {
    const typedef = this.resolve(type)
    return typedef.validator(value, typedef.properties)
  }
}
