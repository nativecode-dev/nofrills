import { IConsole } from './IConsole'

export type OnlyWhen = (...args: string[]) => boolean
export type Startup = (console: IConsole) => Promise<void>

export interface ConsoleOptions {
  initializer?: Startup
  when?: OnlyWhen
}
