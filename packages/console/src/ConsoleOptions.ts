import { IConsole } from './IConsole'

export type Startup = (console: IConsole) => Promise<void>

export interface ConsoleOptions {
  initializer?: Startup
}
