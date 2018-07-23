import { URL } from 'url'
import { load } from 'cheerio'
import { FileSystem as fs } from '@nofrills/fs'

import { Logger } from './Logger'

export abstract class Parser<T> {
  protected baselog = Logger.extend('parser')

  private readonly cachefile: string = fs.join(process.cwd(), '.cache', 'couchbase.json')

  private cache: { [key: string]: string } = {}

  constructor(protected readonly url: URL) { }

  async parse(): Promise<T> {
    if (await fs.exists(this.cachefile)) {
      this.cache = await fs.json<{ [key: string]: string }>(this.cachefile)
    }

    const parsed = await this.run()

    await fs.save(this.cachefile, this.cache)

    return parsed
  }

  protected abstract run(): Promise<T>

  protected async html(url: URL): Promise<CheerioStatic> {
    const urlstring = url.toString()

    if (this.cache[urlstring]) {
      return load(this.cache[urlstring])
    }

    const response = await fetch(urlstring)
    this.baselog.debug('html', urlstring)

    const html = (this.cache[urlstring] = await response.text())

    return load(html)
  }
}
