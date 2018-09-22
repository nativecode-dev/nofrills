import { Lincoln, Logger } from './Logger'

export interface ProcessArgsFilter {
  (argument: string, index: number): boolean
}

export class ProcessArgs {
  private readonly arguments: string[]
  private readonly log: Lincoln = Logger.extend('process-args')

  private constructor(args: string[], node: boolean) {
    this.log.debug(node, ...args)
    this.arguments = this.filter(args, node)
    this.log.debug(this.exe, this.args, this.normalized)
  }

  static from(args: string[], node: boolean = true): ProcessArgs {
    return new ProcessArgs(args, node)
  }

  get args(): string[] {
    return this.arguments
  }

  get argsOnly(): string[] {
    return this.normalized.filter(arg => !arg.startsWith('-'))
  }

  get exe(): string {
    return this.arguments[0]
  }

  get normalized(): string[] {
    return this.arguments.slice(1)
  }

  get switches(): string[] {
    return this.normalized.filter(arg => arg.startsWith('-'))
  }

  has(name: string): boolean {
    return this.switches.some(x => this.normalize(x) === this.normalize(name))
  }

  private filter(args: string[], node: boolean): string[] {
    return node ? args.slice(1) : args
  }

  private normalize(name: string): string {
    const argument = name.startsWith('--') ? name.substring(2) : name.startsWith('-') ? name.substring(1) : name
    return argument.trim().toLowerCase()
  }
}
