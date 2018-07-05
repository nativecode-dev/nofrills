export { Lincoln } from '@nofrills/lincoln-debug'

import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateOptions, CreateLogger, Lincoln, Options } from '@nofrills/lincoln-debug'

const options: Options = CreateOptions('console')
options.interceptors.register('scrubs', ScrubsInterceptor)

export const Logger: Lincoln = CreateLogger(options)
