import { all as throttle } from 'promise-parallel-throttle'
import { Classes, Namespace } from '@nofrills/typings'

import { Parser } from './Parser'
import { ClassParser } from './ClassParser'
import { Couchbase } from './CouchbaseProvider'

export class NamespaceParser extends Parser<Namespace> {
  constructor(private readonly couchbase: Couchbase, protected readonly name: string) {
    super(name, couchbase.url('classes.list.html'))
  }

  protected async exec(): Promise<Namespace> {
    const namespace: Namespace = {
      classes: {},
      enums: {},
      functions: {},
      name: this.name,
      types: {},
      source: this.url.toString(),
    }

    namespace.classes = await this.classes(namespace)

    return namespace
  }

  private async classes(namespace: Namespace): Promise<Classes> {
    const $ = await this.html(this.url)

    const dl = $('div#main section article dl:not([class])')
    const list = Array.from($('dt a', dl[0]))

    const classes = await throttle(
      list.map(a => {
        const page = a.attribs['href']
        const name = $(a)
          .text()
          .trim()

        const parser = new ClassParser(this.couchbase, namespace, name, page)
        return () => parser.parse()
      }),
    )

    return classes.reduce((container, $class) => {
      container[$class.name] = $class
      return container
    }, namespace.classes)
  }
}
