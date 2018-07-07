import { Types } from './Types'
import { ObjectPath } from './ObjectPath'
import { ObjectIterator } from './ObjectIterator'

export class ObjectNavigator implements IterableIterator<ObjectPath> {
  private current: number = 0

  private constructor(
    private readonly object: any,
    public readonly parent?: ObjectNavigator,
    public readonly property?: string
  ) { }

  static inspect(object: any): ObjectNavigator {
    return new ObjectNavigator(object)
  }

  get keys(): string[] {
    return Object.keys(this.object)
  }

  get root(): ObjectNavigator {
    return Array.from(ObjectIterator.iterate(this.object))
      .reduce((result, current) => current.parent ? current.parent : result, this.object)
  }

  get types(): ObjectPath[] {
    return this.keys.map(key => ({
      key,
      path: '',
      type: Types.from(this.object[key]),
      value: this.object[key]
    }))
  }

  get values(): any[] {
    return this.keys.map(key => this.object[key])
  }

  [Symbol.iterator](): IterableIterator<ObjectPath> {
    return this
  }

  next(): IteratorResult<ObjectPath> {
    const key = this.keys[this.current]
    const value = this.object[key]

    const result = {
      value: {
        key,
        path: this.property || '',
        type: Types.from(value),
        value,
      },
      done: this.current === this.keys.length
    }

    this.current++

    return result
  }
}
