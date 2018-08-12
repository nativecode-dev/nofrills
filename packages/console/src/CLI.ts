import { Console } from './Console'
import { ConsoleOptions } from './ConsoleOptions'

export class CLI<T extends ConsoleOptions> extends Console<T> {
  protected constructor(options: T, exe: string, args: string[]) {
    super(options, exe, args)
  }

  static create<T extends ConsoleOptions>(options: T, exe: string, ...args: string[]): Console<T> {
    return new CLI<T>(options, exe, args)
  }
}
