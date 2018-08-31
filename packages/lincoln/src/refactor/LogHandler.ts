import { Log } from './Log'

export interface LogHandler {
  handle(log: Log): Promise<Log | null>
}
