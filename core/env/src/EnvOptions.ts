import { DictionaryOf } from '@nofrills/collections'

import { EnvOverride } from './EnvOverride'

export enum EnvCaseOptions {
  Default = 0,
  CamelCase = 1,
  LowerCase = 2,
  PascalCase = 3,
  UpperCase = Default,
}

export interface EnvOptions {
  casing: EnvCaseOptions
  env: DictionaryOf<string | undefined>
  override?: EnvOverride
  prefix: string
  sync: boolean
}
