import { Filter, Interceptor, LincolnRegistry } from './LincolnRegistry'

export interface Options {
  filters: LincolnRegistry<Filter>,
  interceptors: LincolnRegistry<Interceptor>,
  namespace: string
  separator: string
}
