import { URL } from 'url'
import { Class } from '@nofrills/typings'

import { Parser } from './Parser'
import Logger from './Logger'

export class OptionsParser extends Parser<Class> {
  private readonly log = Logger.extend('options')

  constructor(url: URL, name: string) {
    super(name, url)
  }

  protected exec(): Promise<Class> {
    this.log.debug('exe')
    return Promise.resolve({} as Class)
  }
}
