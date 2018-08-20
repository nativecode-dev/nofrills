export type ChainHandler<T, R> = (object: T, next: ChainHandlerLink<T, R>) => R
export type ChainHandlerLink<T, R> = (object: T) => R
export type ChainHandlers<T, R> = Array<ChainHandler<T, R>>

export type Chains<T> = Chain<T, T>
export type Handler<T, R> = ChainHandler<T, R>
export type Link<T, R> = ChainHandlerLink<T, R>

export class Chain<T, R> {
  private constructor(private readonly handlers: ChainHandlers<T, R> = []) { }

  static from<T, R>(handlers: ChainHandlers<T, R> = []): Chain<T, R> {
    return new Chain(handlers)
  }

  public add(handler: ChainHandler<T, R>): Chain<T, R> {
    this.handlers.push(handler)
    return this
  }

  public execute(object: T, reverse?: boolean, initializer?: () => R): R {
    const initiator: Link<T, R> = (obj: T): R => initializer ? initializer() : {} as R
    const proxy: Link<T, R> = this.proxy(reverse || false, initiator)
    return proxy(object)
  }

  private proxy(reverse: boolean, initiator: Link<T, R>): Link<T, R> {
    const handlers: Array<Handler<T, R>> = (reverse ? this.handlers.reverse() : this.handlers)

    const proxy: Handler<T, R> = handlers.reduce((previous: Handler<T, R>, current: Handler<T, R>): Handler<T, R> => {
      const innerHandler: Handler<T, R> = (object: T, next: Link<T, R>): R => {
        const callee: Link<T, R> = (o: T): R => previous(o, next)
        return current(object, callee)
      }
      return innerHandler
    }, initiator)

    return (object: T) => proxy(object, initiator)
  }
}
