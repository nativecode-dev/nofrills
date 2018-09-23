import { Filter, Interceptor, LincolnRegistry } from './LincolnRegistry'

export interface Options {
  emitNamespace: boolean
  emitTag: boolean
  filters: LincolnRegistry<Filter>
  interceptors: LincolnRegistry<Interceptor>
  namespace: string
  separator: string
}
