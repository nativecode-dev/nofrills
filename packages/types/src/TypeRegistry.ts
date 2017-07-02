import * as collections from '@nofrills/collections'

import { Type } from './Type'

export interface ITypeRegistry {
  register(type: Type): ITypeRegistry
  resolve(name: string): Type
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
}

export const Registry: ITypeRegistry = new TypeRegistry()
