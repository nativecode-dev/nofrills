import * as merge from 'deepmerge'

import { Interceptor, Log } from '@nofrills/lincoln'
import { scrub } from './Registry'

export const ScrubsInterceptor: Interceptor = (log: Log): Log => {
  return scrub(merge.all([log]))
}
