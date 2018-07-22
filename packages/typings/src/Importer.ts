import { Package } from './Packages'
import { Provider } from './Provider'

export class Importer {
  constructor(private readonly reader: Provider) { }

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
