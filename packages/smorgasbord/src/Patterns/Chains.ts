import { Lincoln, Logger } from '../Logging'

export type ChainHandler<T, R> = (object: T, next: ChainHandlerLink<T, Partial<R>>) => Partial<R>
export type ChainHandlerLink<T, R> = (object: T) => Partial<R>
export type ChainHandlers<T, R> = Array<ChainHandler<T, R>>

export class Chain<T, R> {
  private readonly handlers: ChainHandlers<T, R>
  private readonly log: Lincoln
  constructor(handlers?: ChainHandlers<T, R>) {
    this.handlers = handlers ? handlers : []
    this.log = Logger.extend('chain')
  }

  public add(handler: ChainHandler<T, R>): Chain<T, R> {
    this.handlers.push(handler)
    return this
  }

  public execute(object: T, reverse?: boolean, initializer?: () => Partial<R>): R {
    const result: Partial<R> = initializer ? initializer() : {}
    const initial = (obj: T, n: ChainHandler<T, R>): Partial<R> => result
    const handlers = reverse ? this.handlers.reverse() : this.handlers
    const proxy = handlers.reduce((previous: ChainHandler<T, R>, current: ChainHandler<T, R>): ChainHandler<T, R> => {
      return (obj: T, next: ChainHandlerLink<T, Partial<R>>): Partial<R> => {
        return current(object, (o: T): Partial<R> => previous(obj, next))
      }
    }, initial)
    return proxy(object, (o: T): Partial<R> => result) as R
  }
}
