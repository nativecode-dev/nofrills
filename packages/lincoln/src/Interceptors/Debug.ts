import * as debug from 'debug'

import { Interceptor, Log } from '../'

export const Debug: Interceptor = (log: Log): Log => {
  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    const message: string = log.parameters[0]
    const args: any[] = log.parameters.slice(1)
    debug(log.namespace)(message, ...args)
  } else {
    debug(log.namespace)(log.parameters)
  }
  return log
}
