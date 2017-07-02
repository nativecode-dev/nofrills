import * as logging from '@nofrills/lincoln'
import * as scrubs from '@nofrills/scrubs'

const scrubber: logging.Interceptor = (log: logging.Log) => {
  log.parameters = scrubs.scrub(log.parameters)
  return log
}

const options: logging.Options = {
  interceptors: [scrubber, logging.Debug],
  namespace: 'nativecode:smush'
}

export const Logger: logging.Lincoln = new logging.Lincoln(options)
