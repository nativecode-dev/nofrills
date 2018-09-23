import { ObjectNavigator } from './ObjectNavigator'

export class ObjectParentIterator implements IterableIterator<ObjectNavigator> {
  private current: ObjectNavigator = this.object

  private constructor(private readonly object: ObjectNavigator) {}

  [Symbol.iterator](): IterableIterator<ObjectNavigator> {
    return this
  }

  static from(object: ObjectNavigator): ObjectParentIterator {
    return new ObjectParentIterator(object)
  }

  next(): IteratorResult<ObjectNavigator> {
    const result = {
      value: this.current,
      done: this.current.parent === undefined,
    }

    if (this.current.parent) {
      this.current = this.current.parent
    }

    return result
  }
}
