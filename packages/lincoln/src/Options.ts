import { Registry } from '@nofrills/collections'
import { Filter, Interceptor, LincolnRegistry } from './Types'

export interface Options {
  filters: LincolnRegistry<Filter>,
  interceptors: LincolnRegistry<Interceptor>,
  namespace: string
  separator: string
}
