import { Package } from './Packages'
import { ImportReader } from './ImportReader'

export class Importer {
  constructor(private readonly reader: ImportReader) { }

  async import(): Promise<Package> {
    const classes = await this.reader.classes()

    return {
      name: 'couchbase',
      namespaces: [{
        classes,
        enums: [],
        name: 'couchbase',
        types: []
      }]
    }
  }
}
