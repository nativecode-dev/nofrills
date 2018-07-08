import { Interceptor, Log } from '@nofrills/lincoln'
import { scrub } from './Registry'

export const ScrubsInterceptor: Interceptor = (log: Log): Log => {
  return scrub(Object.assign({}, log))
}
