import * as collections from '@nofrills/collections'

import { merge } from 'lodash'

import { Type, TypeProperties } from './Type'

export interface ITypeRegistry {
  register(type: Type): ITypeRegistry
  resolve(name: string): Type
  validate(value: any, type: string): boolean
}

class TypeRegistry implements ITypeRegistry {
  private readonly registry: collections.Registry<Type>

  constructor() {
    this.registry = new collections.Registry<Type>()
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
    throw new TypeError(`Could not find type named '${name}'.`)
  }

  public validate(value: any, type: string): boolean {
    const typedef = Registry.resolve(type)
    return typedef.validator(value)
  }

  private properties(typedef: Type): TypeProperties {
    const basetypes: string[] = ['Array', 'Boolean', 'Date', 'Error', 'Number', 'Object', 'String']
    const properties: TypeProperties[] = []
    let current: Type = typedef
    while (basetypes.indexOf(current.typebase) <= 0) {
      if (current.properties) {
        properties.push(current.properties)
      }
      current = Registry.resolve(current.typebase)
    }
    return merge({}, ...properties)
  }
}

export const Registry: ITypeRegistry = new TypeRegistry()
