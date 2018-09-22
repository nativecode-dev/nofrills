import { generate, Parser, ParserBuildOptions } from 'pegjs'
import { fs, FileResolver, RecursiveStrategy } from '@nofrills/fs'

import { Token } from './tokens/Token'
import { GrammarError } from './errors/GrammarError'
import { KeywordToken } from './tokens/KeywordToken'

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

  async parse(input: string) {
    const parser = await this.generate()
    const config: Token[] = parser.parse(input) as Token[]

    return config
      .filter(token => {
        switch (token.type) {
          case 'host':
          case 'identifier':
          case 'match':
            return true
          default:
            return false
        }
      })
      .reduce(
        (previous, token) => {
          if (token.type === 'host' || token.type === 'match') {
            return [...previous, token as KeywordToken]
          }
          return previous
        },
        [] as KeywordToken[],
      )
  }
}
