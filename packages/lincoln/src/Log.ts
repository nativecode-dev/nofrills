import { LogMessageType } from './LogMessageType'

export interface Log {
  readonly id: string
  readonly namespace: string
  readonly timestamp: number
  readonly type: LogMessageType
  readonly parameters: any[]
}
