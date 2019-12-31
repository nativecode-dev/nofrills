import { CreateLogger, CreateOptions, ScrubsInterceptor } from '@nofrills/scrubs'

const options = CreateOptions('nofrills:http')
options.interceptors.register('scrubs', ScrubsInterceptor)

const Logger = CreateLogger(options)

export default Logger
