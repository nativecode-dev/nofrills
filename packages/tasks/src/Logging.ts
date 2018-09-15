export { Lincoln } from '@nofrills/lincoln-debug'

import { CreateLogger, CreateOptions, Lincoln, Options, Log } from '@nofrills/lincoln-debug'
import { ScrubsInterceptor } from '@nofrills/scrubs'

const LoggerOptions: Options = CreateOptions('nofrills:tasks')
LoggerOptions.interceptors.register('scrubs', ScrubsInterceptor)
export const Logger: Lincoln = CreateLogger(LoggerOptions)

const ConsoleLogOptions: Options = CreateOptions('[tasks]', undefined, [
  [
    'console-log',
    (log: Log) => {
      console.log(log.namespace, ...log.parameters)
      return Promise.resolve(log)
    },
  ],
])
ConsoleLogOptions.emitTag = false
export const ConsoleLog: Lincoln = CreateLogger(ConsoleLogOptions)
