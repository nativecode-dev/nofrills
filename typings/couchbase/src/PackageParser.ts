import { Namespaces, Package } from '@nofrills/typings'

import { Lincoln } from './Logger'
import { Parser } from './Parser'
import { Couchbase } from './CouchbaseProvider'
import { NamespaceParser } from './NamespaceParser'

export class PackageParser extends Parser<Package> {
  private readonly log: Lincoln

  constructor(private readonly couchbase: Couchbase) {
    super(couchbase.url())
    this.log = this.baselog.extend('package')
  }

  protected async run(): Promise<Package> {
    const parser = new NamespaceParser(this.couchbase, 'couchbase')
    const namespace = await parser.parse()

    this.log.debug('parse', namespace.name, this.url.toString())

    const namespaces: Namespaces = {}
    namespaces[namespace.name] = namespace

    return { name: this.couchbase.version, namespaces, source: this.url.toString() }
  }
}
