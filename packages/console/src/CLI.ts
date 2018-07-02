import { Console } from './Console'
import { ConsoleOptions } from './ConsoleOptions'

export class CLI<T extends ConsoleOptions> extends Console<T> {
  constructor(options: T, exe: string, args: string[]) {
    super(options, exe, args)
  }
}
