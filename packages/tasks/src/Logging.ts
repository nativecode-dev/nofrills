export { Lincoln } from '@nofrills/lincoln-debug'

import { CreateLogger, CreateOptions, Lincoln, Options } from '@nofrills/lincoln-debug'
import { ScrubsInterceptor } from '@nofrills/scrubs'

const options: Options = CreateOptions('nofrills:tasks')
options.interceptors.register('scrubs', ScrubsInterceptor)

export const ConsoleLog: Lincoln = CreateLogger({
  ...options,
  emitNamespace: false,
  emitTag: false,
  namespace: 'tasks',
})

export const Logger: Lincoln = CreateLogger(options)
