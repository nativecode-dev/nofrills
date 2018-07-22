import * as cheerio from 'cheerio'

import { URL } from 'url'
import { Class, ImportReader } from '@nofrills/typings'

export class CouchbaseImportReader extends ImportReader {
  constructor(protected readonly url: URL) {
    super(url)
  }

  classes(): Promise<Class[]> {
    cheerio.load()
    return Promise.resolve([])
  }
}
