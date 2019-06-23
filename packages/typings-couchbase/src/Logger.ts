import { CreateLogger, CreateOptions } from '@nofrills/lincoln-debug'
import { ScrubsInterceptor } from '@nofrills/scrubs'

const options = CreateOptions('nofrills:typings-couchbase')
options.interceptors.register('scrubs', ScrubsInterceptor)

const Logger = CreateLogger(options)

export default Logger
