import { Class, Method, Methods, Namespace, Properties, Type } from '@nofrills/typings'

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
    super(name, couchbase.url(page))
    this.log = this.baselog.extend('class')
  }

  protected async run(): Promise<Class> {
    const $ = await this.html(this.url)

    this.log.debug('parse', this.url.toString())

    const $class: Partial<Class> = {
      name: this.name,
      source: this.url.toString(),
    }

    $('div#main section article h3.subsection-title').each((_, element) => {
      const $element = $(element)
      const section = $element.text().toLowerCase()

      this.log.trace('section', section)

      switch (section) {
        case 'members':
          $class.properties = this.properties($, $element.next().children())
          break

        case 'methods':
          $class.methods = this.methods($, $element.next().children())
          break
      }
    })

    return $class as Class
  }

  private methods($: CheerioStatic, element: Cheerio): Methods {
    const methods: Methods = {}

    element.filter('dt').each((_, dt) => {
      const $method = $(dt)

      const id = $method.find('h4.name').attr('id')
      const returns = this.type($method.next().find('dl dd span.param-type a').text().trim())
      const method: Method = { name: id, parameters: {}, return: returns }

      $method.next().find('table.params tbody tr').each((_, tr) => {
        const $param = $(tr)
        const description = $param.find('td.description p').text().trim()
        const name = $param.find('td.name code').text().trim()

        const types: string[] = []

        $param.find('td.type span.param-type')
          .each((_, t) => types.push($(t).text().trim()))

        const type = this.resolve(...types)

        method.parameters[name] = { description, name, type }
      })

      methods[id] = method
    })

    return methods
  }

  private properties($: CheerioStatic, element: Cheerio): Properties {
    const properties: Properties = {}

    element.filter('dt').each((_, dt) => {
      const $dt = $(dt)
      const $dd = $dt.next()
      const id = $dt.attr('id')
      const types: string[] = []

      $dd.find('ul li span.param-type')
        .each((_, span) => types.push($(span).text().trim()))

      properties[id] = {
        name: id,
        readonly: false,
        type: this.resolve(...types),
      }
    })

    return properties
  }

  private resolve(...types: string[]): Type {
    const filtered = types.map(name => this.clean(name))
      .filter((name, index, array) => array.indexOf(name) === index)

    const key = filtered.join('|')
    const references = filtered.map(name => this.type(name))

    return this.type(key, references)
  }

  private type(name: string, reference?: any): Type {
    const key = name

    if (this.namespace.types[key]) {
      return this.namespace.types[key]
    }

    return (this.namespace.types[key] = { external: reference ? true : false, name, reference })
  }

  private clean(name: string): string {
    return name
      .replace('Array.<number>', 'number[]')
      .replace('Array.<string>', 'string[]')
  }
}
