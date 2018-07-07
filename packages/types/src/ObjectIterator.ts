import { ObjectNavigator } from './ObjectNavigator'

export class ObjectIterator implements IterableIterator<ObjectNavigator> {
  private current: ObjectNavigator = this.object

  private constructor(private readonly object: ObjectNavigator) { }

  [Symbol.iterator](): IterableIterator<ObjectNavigator> {
    return this
  }

  static iterate(object: any): ObjectIterator {
    return new ObjectIterator(object)
  }

  next(): IteratorResult<ObjectNavigator> {
    return {
      value: this.current,
      done: this.current.parent === undefined,
    }
  }
}
