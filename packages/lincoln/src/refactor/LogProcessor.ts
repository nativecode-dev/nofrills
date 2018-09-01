import { Log } from './Log'
import { LogHandler } from './LogHandler'

export abstract class LogProcessor {
  constructor(protected readonly handler: LogHandler) { }

  abstract process(log: Log): void
}
