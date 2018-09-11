import 'isomorphic-fetch'

import { URL } from 'url'
import { Package, Provider } from '@nofrills/typings'
import { Lincoln } from './Logger'

import { PackageParser } from './PackageParser'

export const CouchbaseVersion = {
  latest: '2.1.4',
  '2.1.4': '2.1.4',
}

export interface Couchbase {
  version: string
  url(pagename?: string): URL
}

function Create(version: string): Couchbase {
  return {
    version,
    url(name?: string): URL {
      const pagename = name ? `/${name}` : ''
      return new URL(`http://docs.couchbase.com/sdk-api/couchbase-node-client-${version}${pagename}`)
    },
  }
}

export class CouchbaseProvider extends Provider {
  private readonly log: Lincoln

  constructor(version: string = CouchbaseVersion.latest) {
    super(version)
    this.log = this.baselog.extend('couchbase')
  }

  import(): Promise<Package> {
    const couchbase = Create(CouchbaseVersion.latest)
    const parser = new PackageParser(couchbase, 'couchbase')
    this.log.debug('import', couchbase.version)
    return parser.parse()
  }
}
