import { Filter, Interceptor, Options, LincolnRegistry } from '../src'

export const EXTENSION = 'extension'
export const NAMESPACE = 'nativecode:lincoln:test'
export const MESSAGE = 'TEST'

export const Context = {

  filter: (filter: Filter, interceptor?: Interceptor): Options => {
    return {
      filters: new LincolnRegistry<Filter>([['filter', filter]]),
      interceptors: new LincolnRegistry<Interceptor>(interceptor ? [['interceptor', interceptor]] : undefined),
      namespace: NAMESPACE,
      separator: ':',
    }
  },

  intercept: (interceptor: Interceptor, filter?: Filter): Options => {
    return {
      filters: new LincolnRegistry<Filter>(filter ? [['filter', filter]] : undefined),
      interceptors: new LincolnRegistry<Interceptor>([['interceptor', interceptor]]),
      namespace: NAMESPACE,
      separator: ':',
    }
  }

}
