import { URL } from 'url'
import { fs } from '@nofrills/fs'
import { load } from 'cheerio'

export abstract class Parser<T> {
  private readonly cachefile: string

  private cache: { [key: string]: string } = {}

  constructor(name: string, protected readonly url: URL) {
    this.cachefile = fs.join(process.cwd(), '.cache', 'couchbase-cache', `.${name}.json`)
  }

  async parse(): Promise<T> {
    const cached = await fs.exists(this.cachefile)

    if (cached) {
      this.cache = await fs.json<{ [key: string]: string }>(this.cachefile)
    }

    const parsed = await this.exec()

    if (cached === false) {
      const saved = await fs.save(this.cachefile, this.cache)
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
    const text = await response.text()
    const html = (this.cache[urlstring] = text)

    return load(html)
  }
}
