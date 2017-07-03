import { Interceptor, Log } from '@nofrills/lincoln'

import { merge } from 'lodash'
import { scrub } from './Scrubs'

export const ScrubsInterceptor: Interceptor = (log: Log): Log => {
  return scrub(merge({}, log))
}
