import { IConsole } from './IConsole'

export type Startup = (console: IConsole) => void

export interface ConsoleOptions {
  initializer?: Startup
}
