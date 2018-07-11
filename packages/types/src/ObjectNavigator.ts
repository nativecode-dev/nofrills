import { EventEmitter } from 'events'

import { Types } from './Types'
import { ObjectValue } from './ObjectValue'
import { ObjectParentIterator } from './ObjectParentIterator'

export class ObjectNavigator extends EventEmitter implements ObjectValue, IterableIterator<ObjectNavigator> {
  private readonly properties: Map<string, ObjectNavigator>

  private current = 0

  private constructor(
    private readonly proxy: ObjectValue,
    public readonly parent?: ObjectNavigator,
  ) {
    super()
    this.properties = new Map<string, ObjectNavigator>()

    if (proxy.type === 'object') {
      this.inspect(this.proxy)
    }
  }

  static from(value: object, clone: boolean = true): ObjectNavigator {
    const instance = ObjectNavigator.convert('#', value, '', clone)

    if (instance.type !== 'object') {
      throw new Error(`instance was not an object, got: ${instance.type}`)
    }

    return new ObjectNavigator(instance)
  }

  get key(): string {
    return this.proxy.key
  }

  get path(): string {
    return this.proxy.path
  }

  get property(): string {
    return this.proxy.property
  }

  get type(): string {
    return Types.from(this.proxy.value)
  }

  get value(): any {
    return this.proxy.value
  }

  set value(updated: any) {
    this.proxy.value = updated
  }

  [Symbol.iterator](): IterableIterator<ObjectNavigator> {
    return this
  }

  get(key: string): ObjectNavigator {
    return key.split('.').reduce((current: ObjectNavigator, key) => {

      const property = current.properties.get(key)
      if (property) {
        return property
      }
      throw new Error(`could not find property: ${key}`)

    }, this)
  }

  getIndex(index: number): ObjectNavigator {
    const values = Array.from(this.properties.values())
    return values[index]
  }

  getValue<T>(key: string): T {
    return this.get(key).value
  }

  keys(): string[] {
    return Array.from(this.properties.keys())
  }

  next(): IteratorResult<ObjectNavigator> {
    const property = this.getIndex(this.current)

    this.current++

    if (property) {
      return {
        done: this.current >= this.properties.size,
        value: property,
      }
    }

    return {
      done: true,
      value: this,
    }
  }

  parents(): ObjectNavigator[] {
    return Array.from(ObjectParentIterator.from(this)).reverse()
  }

  pathstr(): string {
    return this.parents().map(parent => parent.property).join('.')
  }

  recurse(): void {
    Array.from(this.properties)
      .map(kvp => {
        const name = kvp[0]
        const navigator = kvp[1]
        this.emit('property', name, navigator)
        return navigator
      })
      .map(navigator => navigator.recurse())
  }

  toObject(instance: any = {}): any {
    return Array.from(this.properties.entries())
      .reduce((object, kvp: [string, ObjectNavigator]) => {
        const key = kvp[0]
        const navigator = kvp[1]
        if (navigator.type === 'object') {
          object[key] = navigator.toObject(instance)
        } else {
          object[key] = navigator.value
        }
        return object
      }, instance)
  }

  private static convert(key: string, value: any, path: string, clone: boolean): ObjectValue {
    const type = Types.from(value)

    return {
      key: `${key}::${path}`,
      path,
      property: key,
      type,
      value: type === 'object' && clone ? { ...value } : value,
    }
  }

  private static create(key: string, value: any, parent: ObjectNavigator, clone: boolean): ObjectNavigator {
    const objectValue = ObjectNavigator.convert(key, value, parent.pathstr(), clone)
    return new ObjectNavigator(objectValue, parent)
  }

  private inspect = (ov: ObjectValue, clone: boolean = true) => {
    Object.keys(ov.value)
      .map(key => ObjectNavigator.create(key, ov.value[key], this, clone))
      .map(navigator => this.properties.set(navigator.property, navigator))
  }
}
