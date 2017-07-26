import { Interceptor, Log } from '@nofrills/lincoln'
import { scrub } from './Scrubs'

import merge = require('lodash.merge')

export const ScrubsInterceptor: Interceptor = (log: Log): Log => {
  return scrub(merge({}, log))
}
