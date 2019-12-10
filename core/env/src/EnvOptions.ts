import { DictionaryOf } from '@nofrills/collections'

import { EnvOverride } from './EnvOverride'
import { EnvCaseOptions } from './EnvCaseOptions'

export interface EnvOptions {
  casing: EnvCaseOptions
  env: DictionaryOf<string | undefined>
  override?: EnvOverride
  prefix: string
  sync: boolean
}
