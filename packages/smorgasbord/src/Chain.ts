import { Lincoln, Logger } from './Logging'

export type ChainHandler<T, R> = (object: T, next: ChainHandlerLink<T, R>) => R
export type ChainHandlerLink<T, R> = (object: T) => R
export type ChainHandlers<T, R> = Array<ChainHandler<T, R>>

type Handler<T, R> = ChainHandler<T, R>
type Link<T, R> = ChainHandlerLink<T, R>

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

  public execute(object: T, reverse?: boolean, initializer?: () => R): R {
    if (reverse) {
      this.log.debug('execute.reverse', reverse)
    }
    const initiator: Link<T, R> = (obj: T): R => initializer ? initializer() : {} as R
    const proxy: Link<T, R> = this.proxy(reverse || false, initiator)
    return proxy(object) as R
  }

  private proxy(reverse: boolean, initiator: Link<T, R>): Link<T, R> {
    const handlers: Array<Handler<T, R>> = (reverse ? this.handlers.reverse() : this.handlers)

    const proxy: Handler<T, R> = handlers.reduce((previous: Handler<T, R>, current: Handler<T, R>): Handler<T, R> => {
      this.log.debug('execute.proxy', previous, current)
      const innerHandler: Handler<T, R> = (object: T, next: Link<T, R>): R => {
        const callee: Link<T, R> = (o: T): R => previous(object, next)
        const processed = current(object, callee)
        this.log.debug('execute.proxy.call', processed, object, next)
        return processed
      }
      return innerHandler
    }, initiator)

    return (object: T) => proxy(object, initiator)
  }
}

export type Chains<T> = Chain<T, T>
