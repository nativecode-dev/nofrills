import { Registry } from '@nofrills/collections'
import { Filter, Interceptor } from './Types'

export interface Options {
  filters: Registry<Filter>,
  interceptors: Registry<Interceptor>,
  namespace: string
  separator: string
}
