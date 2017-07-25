import { Lincoln, Logger } from '../Logging'

export type ChainHandler<T, R> = (object: T, next: ChainHandlerLink<T, R>) => Partial<R>
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
    this.log.debug('add', handler)
    return this
  }

  public execute(object: T, reverse?: boolean, initializer?: () => Partial<R>): R {
    if (reverse) {
      this.log.debug('execute.reverse', reverse)
    }
    const result: Partial<R> = initializer ? initializer() : {}
    const initial = (obj: T, n: ChainHandler<T, R>): Partial<R> => result
    const handlers = reverse ? this.handlers.reverse() : this.handlers
    const proxy = handlers.reduce((previous: ChainHandler<T, R>, current: ChainHandler<T, R>): ChainHandler<T, R> => {
      this.log.debug('execute.proxy', previous, current)
      const inner = (obj: T, next: ChainHandlerLink<T, R>): Partial<R> => {
        const processed = current(object, (o: T): Partial<R> => previous(obj, next))
        this.log.debug('execute.proxy.call', processed, obj, next)
        return processed
      }
      return inner
    }, initial)
    return proxy(object, (o: T): Partial<R> => result) as R
  }
}

export type Chains<T> = Chain<T, T>
