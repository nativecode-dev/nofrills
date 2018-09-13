import { Filter, Interceptor, Options, LincolnRegistry } from '../src'

export const EXTENSION = 'extension'
export const NAMESPACE = 'nativecode:lincoln:test'
export const MESSAGE = 'TEST'

export const Context = {
  filter: (filter: Filter, options: Partial<Options> = {}): Options => {
    return {
      ...{
        emitNamespace: true,
        emitTag: true,
        filters: new LincolnRegistry<Filter>([['filter', filter]]),
        interceptors: new LincolnRegistry<Interceptor>([]),
        namespace: NAMESPACE,
        separator: ':',
      },
      ...options,
    }
  },

  intercept: (interceptor: Interceptor, options: Partial<Options> = {}): Options => {
    return {
      ...{
        emitNamespace: true,
        emitTag: true,
        filters: new LincolnRegistry<Filter>([]),
        interceptors: new LincolnRegistry<Interceptor>([['interceptor', interceptor]]),
        namespace: NAMESPACE,
        separator: ':',
      },
      ...options,
    }
  },
}
