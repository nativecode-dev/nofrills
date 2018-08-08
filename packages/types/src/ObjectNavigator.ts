import { EventEmitter } from 'events'

import { Types } from './Types'
import { ObjectValue } from './ObjectValue'
import { ObjectParentIterator } from './ObjectParentIterator'

export enum ObjectNavigatorEvents {
  Property = 'property',
}

export type OnProperty = (name: string, value: ObjectNavigator) => void

export class ObjectNavigator extends EventEmitter implements ObjectValue, IterableIterator<ObjectNavigator> {
  private readonly properties: Map<string, ObjectNavigator>

  private current = 0

  private constructor(
    private readonly proxy: ObjectValue,
    public readonly parent?: ObjectNavigator,
  ) {
    super()
    this.properties = new Map<string, ObjectNavigator>()

    this.inspect(this.proxy)
  }

  static from(value: object): ObjectNavigator {
    const instance = ObjectNavigator.convert('#', value, '')

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
        done: this.current > this.properties.size,
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

  recurse(onProperty?: OnProperty): ObjectNavigator[] {
    return Array.from(this.properties)
      .map(kvp => {
        const name = kvp[0]
        const navigator = kvp[1]
        if (onProperty) {
          onProperty(name, navigator)
        }
        this.emit(ObjectNavigatorEvents.Property, name, navigator)
        return navigator
      })
      .map(navigator => navigator.recurse(onProperty))
      .reduce((result, children) => [...result, ...children], [])
  }

  set<T>(key: string, value: T): ObjectNavigator {
    const objectValue = ObjectNavigator.convert(key, value, this.pathstr())
    const navigator = new ObjectNavigator(objectValue)
    this.properties.set(key, navigator)
    return navigator
  }

  toObject(instance: any = {}): any {
    return Array.from(this.properties.entries())
      .reduce((object, kvp: [string, ObjectNavigator]) => {
        const key = kvp[0]
        const property = kvp[1]
        if (property.type === 'object') {
          object[key] = property.toObject()
        } else {
          object[key] = property.value
        }
        return object
      }, instance)
  }

  private static convert(key: string, value: any, path: string): ObjectValue {
    const keyid = path && path.length ? `${path}::${key}` : key
    const type = Types.from(value)

    return {
      key: keyid,
      path,
      property: key,
      type,
      value,
    }
  }

  private static create(key: string, value: any, parent: ObjectNavigator): ObjectNavigator {
    const objectValue = ObjectNavigator.convert(key, value, parent.pathstr())
    return new ObjectNavigator(objectValue, parent)
  }

  private inspect(ov: ObjectValue) {
    if (ov.type === 'object' && ov.value) {
      Object.keys(ov.value)
        .map(key => ObjectNavigator.create(key, ov.value[key], this))
        .map(navigator => this.properties.set(navigator.property, navigator))
    }
  }
}
