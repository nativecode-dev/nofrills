import { ScrubsInterceptor } from '@nofrills/scrubs'
import { CreateOptions, CreateLogger } from '@nofrills/lincoln-debug'

const options = CreateOptions('nofrills:console', [], [['scrubs-interceptor', ScrubsInterceptor]])
const Logger = CreateLogger(options)

export default Logger
