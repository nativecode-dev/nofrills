import { Namespace, Package } from '@nofrills/typings'

import { Lincoln } from './Logger'
import { Parser } from './Parser'
import { Couchbase } from './CouchbaseProvider'
import { NamespaceParser } from './NamespaceParser'

export class PackageParser extends Parser<Package> {
  private readonly log: Lincoln

  constructor(
    private readonly couchbase: Couchbase,
    private readonly name: string,
  ) {
    super(couchbase.version, couchbase.url())
    this.log = this.baselog.extend('package')
  }

  protected async exec(): Promise<Package> {
    const parser = new NamespaceParser(this.couchbase, 'couchbase')
    const namespace = await parser.parse()

    this.log.debug('parse', namespace.name, this.url.toString())

    const namespaces: Namespace[] = []
    namespaces.push(namespace)

    return { name: this.name, namespaces, source: this.url.toString(), version: this.couchbase.version }
  }
}
