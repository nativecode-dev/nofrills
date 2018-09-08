import { IConsole } from './IConsole'

export type Startup = (console: IConsole, ...args: string[]) => Promise<void>

export interface ConsoleOptions {
  initializer?: Startup
}
