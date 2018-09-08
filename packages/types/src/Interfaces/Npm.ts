import { DictionaryOf } from './DictionaryOf'

export interface NpmUrl {
  type?: string
  url?: string
}

export interface Npm {
  author?: string | string[] | DictionaryOf<string>
  bin?: string | DictionaryOf<string>
  bugs?: string | NpmUrl
  dependencies?: DictionaryOf<string>
  description?: string
  devDependencies?: DictionaryOf<string>
  homepage?: string
  license?: string
  main?: string
  name: string
  private?: boolean
  repository?: string | NpmUrl
  scripts?: DictionaryOf<string>
  types?: string
  typeScriptVersion: string
  typings?: string
  version: string
  workspaces?: string[]
}
