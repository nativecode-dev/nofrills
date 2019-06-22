import { CreateLogger, CreateOptions, Lincoln, Options } from '@nofrills/lincoln-debug'
import { ScrubsInterceptor } from '@nofrills/scrubs'

const options: Options = CreateOptions('nofrills:projector')
options.interceptors.register('scrubs', ScrubsInterceptor)

const Logger: Lincoln = CreateLogger(options)

export default Logger
