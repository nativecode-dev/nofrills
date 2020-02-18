import { URL } from 'url'
import { Class } from '@nofrills/typings'

import { Parser } from './Parser'

export class OptionsParser extends Parser<Class> {
  constructor(url: URL, name: string) {
    super(name, url)
  }

  protected exec(): Promise<Class> {
    return Promise.resolve({} as Class)
  }
}
