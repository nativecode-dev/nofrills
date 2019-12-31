export * from '@nofrills/lincoln'

import debug from 'debug'

import { RegistryEntries } from '@nofrills/collections'
import { Filter, Interceptor, Lincoln, LincolnRegistry, Log, Options } from '@nofrills/lincoln'

interface DebugCache {
  [key: string]: debug.IDebugger
}

const Cache: DebugCache = {}

export const DebugInterceptor: Interceptor = (log: Log): Log => {
  const logger: debug.IDebugger = Cache[log.namespace]
    ? Cache[log.namespace]
    : (Cache[log.namespace] = debug(log.namespace))

  if (log.parameters.length && typeof log.parameters[0] === 'string') {
    logger(log.parameters[0], log.parameters.slice(1))
  } else {
    logger(log.parameters)
  }
  return log
}

export const CreateOptions = (
  namespace: string,
  filters?: RegistryEntries<Filter>,
  interceptors?: RegistryEntries<Interceptor>,
): Options => {
  const options: Options = {
    emitNamespace: true,
    emitTag: true,
    filters: new LincolnRegistry<Filter>(filters),
    interceptors: new LincolnRegistry<Interceptor>(interceptors),
    namespace,
    separator: ':',
  }

  options.interceptors.register('debug-interceptor', DebugInterceptor)

  return options
}

export const CreateLogger = (options: string | Options | Partial<Options>): Lincoln => {
  if (typeof options === 'string') {
    return new Lincoln(CreateOptions(options))
  }
  return new Lincoln(options)
}
