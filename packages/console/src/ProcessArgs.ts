import { Lincoln, Logger } from './Logger'

export interface ProcessArgsFilter {
  (argument: string, index: number): boolean
}

export class ProcessArgs {
  private readonly filtered: string[]
  private readonly log: Lincoln = Logger.extend('process-args')

  private constructor(args: string[], node: boolean) {
    this.log.debug(node, ...args)
    this.filtered = this.filter(args, node)
    this.log.debug(this.exe, this.args, this.normalized)
  }

  static from(args: string[], node: boolean = true): ProcessArgs {
    return new ProcessArgs(args, node)
  }

  get args(): string[] {
    return this.filtered
  }

  get exe(): string {
    return this.filtered[0]
  }

  get normalized(): string[] {
    return this.filtered.slice(1)
  }

  private filter(args: string[], node: boolean): string[] {
    return node ? args.slice(1) : args
  }
}
