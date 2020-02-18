import { Namespaces, Package } from '@nofrills/typings'

import { Parser } from './Parser'
import { Couchbase } from './CouchbaseProvider'
import { NamespaceParser } from './NamespaceParser'

export class PackageParser extends Parser<Package> {
  constructor(private readonly couchbase: Couchbase, private readonly name: string) {
    super(couchbase.version, couchbase.url())
  }

  protected async exec(): Promise<Package> {
    const parser = new NamespaceParser(this.couchbase, 'couchbase')
    const namespace = await parser.parse()

    const namespaces: Namespaces = {}
    namespaces[namespace.name] = namespace

    return { name: this.name, namespaces, source: this.url.toString(), version: this.couchbase.version }
  }
}
