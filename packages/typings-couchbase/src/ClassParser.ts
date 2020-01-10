import { Class, Constructor, Method, Methods, Namespace, Parameters, Properties, Type } from '@nofrills/typings'

import Logger from './Logger'

import { Parser } from './Parser'
import { Couchbase } from './CouchbaseProvider'

export class ClassParser extends Parser<Class> {
  private readonly log = Logger.extend('class-parser')

  constructor(
    protected readonly couchbase: Couchbase,
    private readonly namespace: Namespace,
    private readonly name: string,
    page: string,
  ) {
    super(name, couchbase.url(page))
    this.log = this.baselog.extend('class')
  }

  protected async exec(): Promise<Class> {
    const $ = await this.html(this.url)

    this.log.debug('parse', this.url.toString())

    const $class: Class = {
      constructors: [],
      description: $('div#main > section > header > div.class-description > p')
        .text()
        .trim(),
      methods: {},
      name: this.name,
      properties: {},
      source: this.url.toString(),
    }

    this.constructors($class.constructors, $)

    $('div#main > section > article > h3.subsection-title').each((_, element) => {
      const $element = $(element)
      const section = $element.text()

      switch (section) {
        case 'Classes':
          break

        case 'Events':
          break

        case 'Members':
          this.properties($class.properties, $, $element.next().children())
          break

        case 'Methods':
          this.methods($class.methods, $, $element.next().children())
          break

        case 'Type Definitions':
          break
      }

      this.log.trace(`${this.name}:${section}`)
    })

    return $class
  }

  private constructors(constructors: Constructor[], $: CheerioStatic): void {
    const $params = $('div#main > section > article > div.container-overview > dd > table.params > tbody > tr')
    if ($params.length) {
      const constructor: Constructor = { parameters: {}, public: true }
      this.parameter(constructor.parameters, $, $params)
      constructors.push(constructor)
    }
  }

  private methods(methods: Methods, $: CheerioStatic, element: Cheerio): void {
    element.filter('dt').each((_, dt) => {
      const $method = $(dt)

      const id = $method.find('h4.name').attr('id')
      const returns = this.type(
        $method
          .next()
          .find('dl dd span.param-type a')
          .text()
          .trim(),
      )
      const method: Method = { name: id!, parameters: {}, return: returns }

      $method
        .next()
        .find('> table.params > tbody > tr')
        .each((_, tr) => this.parameter(method.parameters, $, $(tr)))

      methods[method.name] = method
    })
  }

  private parameter(parameters: Parameters, $: CheerioStatic, $param: Cheerio): void {
    const optional =
      $param
        .find('> td.attributes')
        .text()
        .trim() === '<optional>'
    const description = $param
      .find('> td.description > p')
      .text()
      .trim()
    const name = $param
      .find('> td.name > code')
      .text()
      .trim()
    const types: string[] = []

    $param.find('> td.type > span.param-type').each((_, t) =>
      types.push(
        $(t)
          .text()
          .trim(),
      ),
    )

    const type = this.resolve(...types)
    parameters[name] = { description, name, optional, type }
  }

  private properties(properties: Properties, $: CheerioStatic, element: Cheerio): void {
    element.filter('dt').each((_, dt) => {
      const $property = $(dt)
      const $types = $property.next()
      const name = $property.attr('id')
      const types: string[] = []

      $types.find('ul li span.param-type').each((_, span) =>
        types.push(
          $(span)
            .text()
            .trim(),
        ),
      )

      properties[name!] = { name: name!, readonly: false, type: this.resolve(...types) }
    })
  }

  private resolve(...types: string[]): Type {
    const filtered = types
      .map(name => this.typename(name))
      .filter((name, index, array) => array.indexOf(name) === index)

    const key = filtered.join('|')

    if (filtered.length === 1) {
      return this.type(key)
    }

    return this.type(key, filtered)
  }

  private type(name: string, basetypes: string[] = []): Type {
    const keyname = this.typename(name)

    if (this.namespace.types[keyname]) {
      return this.namespace.types[keyname]
    }

    return (this.namespace.types[keyname] = { name: keyname, basetypes })
  }

  private typename(name: string): string {
    if (!name || name === '') {
      return 'void'
    }

    if (name === '*') {
      return 'any'
    }

    return name.replace(/Array\.<(.*)>/g, 'Array<$1>')
  }
}
