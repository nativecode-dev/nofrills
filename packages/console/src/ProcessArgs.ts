export interface ProcessArgsFilter {
  (argument: string): boolean
}

const ExcludeCurrentProcess: ProcessArgsFilter = argument => process.execPath !== argument

export class ProcessArgs {
  private readonly arguments: string[]

  constructor(args: string[]) {
    this.arguments = this.process(args)
  }

  static from(args: string[]): ProcessArgs {
    return new ProcessArgs(args)
  }

  get args(): string[] {
    return this.arguments
  }

  get exe(): string {
    return this.arguments[0]
  }

  get normalized(): string[] {
    return this.arguments.slice(1)
  }

  private process(args: string[], filter: ProcessArgsFilter = ExcludeCurrentProcess): string[] {
    return args.filter(filter)
  }
}
