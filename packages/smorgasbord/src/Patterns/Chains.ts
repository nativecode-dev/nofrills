export type ChainHandler<T, R> = (object: T, next: ChainHandlerLink<T, Partial<R>>) => Partial<R>
export type ChainHandlerLink<T, R> = (object: T) => Partial<R>
export type ChainHandlers<T, R> = Array<ChainHandler<T, R>>

export class Chain<T, R> {
  private handlers: ChainHandlers<T, R>
  constructor(handlers?: ChainHandlers<T, R>) {
    this.handlers = handlers ? handlers : []
  }

  public add(handler: ChainHandler<T, R>): Chain<T, R> {
    this.handlers.push(handler)
    return this
  }

  public execute(object: T, reverse?: boolean, initializer?: () => Partial<R>): R {
    const result: Partial<R> = initializer ? initializer() : {}
    const reducer = (previous: Partial<R>, current: ChainHandler<T, R>): Partial<R> => {
      return Object.assign(previous, current(object, (obj: T): Partial<R> => previous))
    }
    return (reverse ? this.handlers.reverse() : this.handlers)
      .reduce(reducer, result) as R
  }
}
