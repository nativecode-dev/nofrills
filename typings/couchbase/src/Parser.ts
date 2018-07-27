import { URL } from 'url'
import { load } from 'cheerio'
import { FileSystem as fs } from '@nofrills/fs'

import { Logger } from './Logger'

export abstract class Parser<T> {
  protected baselog = Logger.extend('parser')

  private readonly cachefile: string

  private cache: { [key: string]: string } = {}

  constructor(name: string, protected readonly url: URL) {
    this.cachefile = fs.join(process.cwd(), 'couchbase-cache', `.${name}.json`)
  }

  async parse(): Promise<T> {
    const cached = await fs.exists(this.cachefile)

    if (cached) {
      this.cache = await fs.json<{ [key: string]: string }>(this.cachefile)
      this.baselog.debug('cache.load', this.cachefile)
    }

    const parsed = await this.exec()

    if (cached === false) {
      const saved = await fs.save(this.cachefile, this.cache)
      this.baselog.debug('cache.save', this.cachefile, saved)
    }

    return parsed
  }

  protected abstract exec(): Promise<T>

  protected async html(url: URL): Promise<CheerioStatic> {
    const urlstring = url.toString()

    if (this.cache[urlstring]) {
      return load(this.cache[urlstring])
    }

    const response = await fetch(urlstring)
    this.baselog.debug('html', urlstring)

    const text = await response.text()
    const html = (this.cache[urlstring] = text)

    return load(html)
  }
}
