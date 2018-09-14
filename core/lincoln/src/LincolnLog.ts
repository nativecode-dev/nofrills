import { Log } from './Log'

export interface LincolnLog {
  write(log: Log): Promise<boolean | undefined>
}
