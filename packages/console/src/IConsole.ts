import { ProcessArgs } from './ProcessArgs'

export interface IConsole {
  readonly args: ProcessArgs

  start(): Promise<void>

  stop(): void
}
