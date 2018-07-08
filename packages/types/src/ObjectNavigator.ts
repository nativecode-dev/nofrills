import { Types } from './Types'
import { ObjectPath } from './ObjectPath'
import { ObjectParentIterator } from './ObjectParentIterator'

export class ObjectNavigator implements IterableIterator<ObjectPath> {
  private current: number = 0

  private constructor(
    private readonly object: any,
    public readonly parent?: ObjectNavigator,
    public readonly property?: string,
    private readonly type = Types.from(object),
  ) {
  }

  static from(object: any): ObjectNavigator {
    return new ObjectNavigator(object)
  }

  get keys(): string[] {
    return this.type === 'object' ? Object.keys(this.object) : []
  }

  get name(): string {
    return this.property ? this.property : ''
  }

  get path(): ObjectNavigator[] {
    return Array.from(ObjectParentIterator.from(this)).reverse()
  }

  get root(): ObjectNavigator {
    return Array.from(ObjectParentIterator.from(this)).reverse()
      .reduce((previous, current) => current.parent ? current.parent : previous, this.object)
  }

  get values(): any[] {
    return this.type === 'object' ? this.keys.map(key => this.object[key]) : [this.object]
  }

  [Symbol.iterator](): IterableIterator<ObjectPath> {
    return this
  }

  get<T>(key: string): T {
    return this.wrap(key, this.object[key]).value
  }

  next(): IteratorResult<ObjectPath> {
    if (this.type !== 'object') {
      return {
        value: this.object,
        done: true,
      }
    }

    const key = this.keys[this.current]
    const value = this.object[key]

    const result = {
      value: this.wrap(key, value),
      done: this.current === this.keys.length
    }

    this.current++

    return result
  }

  set<T>(key: string, value: T) {
    this.object[key] = value
  }

  value(key: string): ObjectPath {
    return this.type === 'object' ? this.wrap(key, this.object[key]) : this.wrap(key, this.object)
  }

  private wrap(key: string, value: any): ObjectPath {
    return {
      key,
      navigator: new ObjectNavigator(value, this, key),
      path: this.path.map(x => x.name).join('.'),
      type: Types.from(value),
      value,
    }
  }
}
