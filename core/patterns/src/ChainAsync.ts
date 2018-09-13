export type ChainAsyncHandler<T, R> = (
  value: T,
  next: ChainAsyncHandlerLink<T, R>,
) => Promise<R>
export type ChainAsyncHandlerLink<T, R> = (value: T) => Promise<R>
export type ChainAsyncHandlers<T, R> = Array<ChainAsyncHandler<T, R>>

export type ChainsAsync<T> = ChainAsync<T, T>
export type LinkAsync<T, R> = ChainAsyncHandlerLink<T, R>

export class ChainAsync<T, R> {
  private constructor(private readonly handlers: ChainAsyncHandlers<T, R>) {}

  static from<T, R>(handlers: ChainAsyncHandlers<T, R> = []): ChainAsync<T, R> {
    return new ChainAsync(handlers)
  }

  public add(handler: ChainAsyncHandler<T, R>): ChainAsync<T, R> {
    this.handlers.push(handler)
    return this
  }

  public execute(
    value: T,
    initializer: () => Promise<R>,
    reverse: boolean = false,
  ): Promise<R> {
    return this.proxy(reverse, initializer)(value)
  }

  private proxy(reverse: boolean, initiator: LinkAsync<T, R>): LinkAsync<T, R> {
    const handlers = reverse ? this.handlers.reverse() : this.handlers

    const proxy = handlers.reduce(
      (previous, current) => (value, next): Promise<R> =>
        current(value, outerValue => previous(outerValue, next)),
      initiator,
    )

    return (object: T) => proxy(object, initiator)
  }
}
