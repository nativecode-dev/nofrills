import 'isomorphic-fetch'

import { load } from 'cheerio'

import { URL } from 'url'
import { Class, Provider } from '@nofrills/typings'

export class CouchbaseProvider extends Provider {
  constructor(version: string = '2.1.4') {
    super(new URL(`http://docs.couchbase.com/sdk-api/couchbase-node-client-${version}/classes.list.html`))
  }

  async classes(): Promise<Class[]> {
    const response = await fetch(this.url.toString())
    const html = await response.text()
    const $ = load(html)

    const classes = this.getClassIndex($)

    return Array.from(classes).map(node => ({
      name: node.nodeValue,
      methods: [],
      properties: [],
      source: node.attribs['href'],
    }))
  }

  protected getClassIndex($: CheerioStatic): Cheerio {
    const classes = $('section article dl')[0]
    console.log(classes.childNodes)
    return $('dt a', classes)
  }

  protected getEventIndex($: CheerioStatic): Cheerio {
    const events = $('section article dl')[1]
    return $('dt a', events)
  }
}
