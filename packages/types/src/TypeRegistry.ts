import { Registry as RegistryType } from '@nofrills/collections'

import { Type, TypeProperties } from './Type'
import { TypeParser } from './TypeParser'

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
    const typedef = Registry.resolve(type)
    return typedef.validator(value)
  }
}

export const Registry: TypeRegistry = new TypeRegistry()
