export { Lincoln } from '@nofrills/lincoln-debug'

import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateOptions, CreateLogger, Lincoln, Options } from '@nofrills/lincoln-debug'

const options: Options = CreateOptions('nofrills:console', [], [['scrubs-interceptor', ScrubsInterceptor]])

export const Logger: Lincoln = CreateLogger(options)
