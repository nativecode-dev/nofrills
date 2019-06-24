import { DictionaryOf } from '@nofrills/collections'

import { EnvOverride } from './EnvOverride'

export interface EnvOptions {
  env: DictionaryOf<string | undefined>
  override?: EnvOverride
  prefix: string
  sync: boolean
}
