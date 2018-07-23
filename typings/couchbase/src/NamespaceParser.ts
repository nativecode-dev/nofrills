import { all as throttle } from 'promise-parallel-throttle'
import { Classes, Namespace } from '@nofrills/typings'

import { Parser } from './Parser'
import { Lincoln } from './Logger'
import { ClassParser } from './ClassParser'
import { Couchbase } from './CouchbaseProvider'

export class NamespaceParser extends Parser<Namespace> {
  private readonly log: Lincoln

  constructor(private readonly couchbase: Couchbase, protected readonly name: string) {
    super(couchbase.url('classes.list.html'))
    this.log = this.baselog.extend('namespace')
  }

  protected async run(): Promise<Namespace> {
    const namespace: Namespace = {
      classes: {},
      enums: {},
      name: this.name,
      types: {},
      source: this.url.toString(),
    }

    namespace.classes = await this.classes(namespace)

    return namespace
  }

  private async classes(namespace: Namespace): Promise<Classes> {
    const $ = await this.html(this.url)
    this.log.debug('classes', this.url.toString())

    const dl = $('div#main section article dl:not([class])')
    const list = Array.from($('dt a', dl[0]))

    const classes = await throttle(list.map(a => {
      const page = a.attribs['href']
      const name = $(a).text().trim()

      this.log.debug('class', name, page)

      const parser = new ClassParser(this.couchbase, namespace, name, page)
      return () => parser.parse()
    }))

    return classes.reduce((previous, current) => {
      previous[current.name] = current
      return previous
    }, namespace.classes)
  }
}
