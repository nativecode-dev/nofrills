import { Token } from './Token'

export interface KeywordToken extends Token {
  keyword: string
  value: string
}
