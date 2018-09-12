import { fs, FileResolver, RecursiveStrategy } from '@nofrills/fs'
import { generate, Parser, ParserBuildOptions } from 'pegjs'

import { GrammarError } from './errors/GrammarError'

export class SshParser {
  private readonly resolver: FileResolver

  protected constructor(cwd: string, private readonly grammar: string) {
    this.resolver = FileResolver.from(cwd, [RecursiveStrategy])
  }

  static from(cwd: string, grammar: string = 'config.pegjs'): SshParser {
    return new SshParser(cwd, grammar)
  }

  async generate(): Promise<Parser> {
    const grammars = await this.resolver.find(this.grammar)

    if (grammars.length) {
      const options: ParserBuildOptions = {
        cache: true,
        optimize: 'speed',
      }

      const grammar = await fs.readFile(grammars[0])
      const parser = generate(grammar.toString(), options)
      return parser
    }

    throw new GrammarError(`could not find grammar: ${this.resolver.cwd} ${this.grammar}`)
  }
}
