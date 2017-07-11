export { Filter, Interceptor, Lincoln, LincolnRegistry, Log, Options } from '@nofrills/lincoln'

import * as debug from 'debug'

import { Filter, Interceptor, Lincoln, LincolnRegistry, Log, Options } from '@nofrills/lincoln'

export const DebugInterceptor: Interceptor = (log: Log): Log => {
  const logger: debug.IDebugger = debug(log.namespace)
  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    logger(log.parameters[0], log.parameters.slice(1))
  } else {
    logger(log.parameters)
  }
  return log
}

export const CreateOptions = (namespace: string): Options => {
  const options: Options = {
    filters: new LincolnRegistry<Filter>(),
    interceptors: new LincolnRegistry<Interceptor>(),
    namespace,
    separator: ':',
  }

  options.interceptors.register('debug', DebugInterceptor)

  return options
}

export const CreateLogger = (options: string | Options): Lincoln => {
  if (typeof options === 'string') {
    return new Lincoln(CreateOptions(options))
  }
  return new Lincoln(options)
}
