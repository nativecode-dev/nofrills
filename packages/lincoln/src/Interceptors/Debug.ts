import * as debug from 'debug'

import { Interceptor, Log } from '../Lincoln'

export const Debug: Interceptor = (log: Log): Log => {
  debug(log.namespace)(log.parameters)
  return log
}
