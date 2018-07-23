import { Package } from './Packages'
import { Provider } from './Provider'

export class Importer {
  constructor(private readonly reader: Provider) { }

  import(): Promise<Package> {
    return this.reader.import()
  }
}
