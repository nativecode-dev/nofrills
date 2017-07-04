import { Filter, Interceptor } from './Types'

export interface Options {
  filters: Filter[]
  interceptors: Interceptor[]
  namespace: string
  separator: string
}
