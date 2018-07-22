import 'isomorphic-fetch'

import { load } from 'cheerio'

import { URL } from 'url'
import { Class, ImportReader } from '@nofrills/typings'

export class CouchbaseImportReader extends ImportReader {
  constructor(version: string = '2.1.4') {
    super(new URL(`http://docs.couchbase.com/sdk-api/couchbase-node-client-${version}/classes.list.html`))
  }

  async classes(): Promise<Class[]> {
    const response = await fetch(this.url.toString())
    const html = await response.text()
    const $ = load(html)

    const classes = this.getClassIndex($)
    classes.map((_, element) => element.nodeValue)

    return Promise.resolve([])
  }

  protected getClassIndex($: CheerioStatic): Cheerio {
    return $('dt a', $('section article dl')[0])
  }

  protected getEventIndex($: CheerioStatic): Cheerio {
    return $('dt a', $('section article dl')[1])
  }
}
