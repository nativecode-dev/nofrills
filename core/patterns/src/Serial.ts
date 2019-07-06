export interface PromiseFactory<T> {
  (): Promise<T>
}

export type PromiseFactories<T> = PromiseFactory<T>[]

export interface PromiseFactoryInitiator<T> {
  (): Promise<T[]>
}

export function serial<T>(
  promises: PromiseFactories<T>,
  initiator: PromiseFactoryInitiator<T> = () => Promise.resolve([]),
): Promise<T[]> {
  return promises.reduce<Promise<T[]>>(async (previous, next) => {
    const results = await previous
    const result = await next()
    return [...results, result]
  }, initiator())
}
