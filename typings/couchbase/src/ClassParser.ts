import { Class, Namespace, Method, Methods, Properties, Property, Type } from '@nofrills/typings'

import { Parser } from './Parser'
import { Lincoln } from './Logger'
import { Couchbase } from './CouchbaseProvider'

export class ClassParser extends Parser<Class> {
  private readonly log: Lincoln

  constructor(
    protected readonly couchbase: Couchbase,
    private readonly namespace: Namespace,
    private readonly name: string,
    page: string,
  ) {
    super(couchbase.url(page))
    this.log = this.baselog.extend('class')
  }

  protected async run(): Promise<Class> {
    const $ = await this.html(this.url)

    this.log.debug('parse', this.url.toString())

    const metadata: Class = {
      name: this.name,
      methods: this.methods($),
      properties: this.properties($),
      source: this.url.toString(),
    }

    this.namespace.types[this.name] = this.type(this.name, true, metadata)

    return metadata
  }

  private method($: CheerioStatic, dt: CheerioElement, dd: CheerioElement): Method {
    const name = $('span.type-signature', dt).text().trim()
    this.log.debug('method', name)
    const metadata: Method = { name }
    return metadata
  }

  private methods($: CheerioStatic): Methods {
    const results: Methods = {}

    this.section($, 2, (dt: CheerioElement, dd: CheerioElement) => {
      const method = this.method($, dt, dd)
      results[method.name] = method
    })

    return results
  }

  private properties($: CheerioStatic): Properties {
    const results: Properties = {}

    this.section($, 1, (dt: CheerioElement, dd: CheerioElement) => {
      const property = this.property($, dt, dd)
      results[property.name] = property
    })

    return results
  }

  private property($: CheerioStatic, dt: CheerioElement, dd: CheerioElement): Property {
    const name = $(dd).text().trim()
    const type = this.type(dt.attribs['id'])

    this.log.debug('property', name)

    const metadata: Property = { name, readonly: false, type }
    return metadata
  }

  private section($: CheerioStatic, index: number, callback: (dt: CheerioElement, dd: CheerioElement) => void): void {
    const list = $('div#main section article dl:not([class])')
    const items = $(list[index])

    for (let index = 0; index < items.length; index + 2) {
      const dt = items[index]
      const dd = items[index + 1]
      this.log.trace(`section:${index}`)
      callback(dt, dd)
    }

    this.log.debug('section', items.length)
  }

  private type(name: string, external: boolean = false, reference?: any): Type {
    if (this.namespace.types[name]) {
      return this.namespace.types[name]
    }

    return (this.namespace.types[name] = { external, name, reference })
  }
}
