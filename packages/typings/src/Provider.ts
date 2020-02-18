import { Package } from './Packages'

export abstract class Provider {
  protected readonly package: Package

  constructor(name: string) {
    this.package = { name, namespaces: {}, version: '' }
  }

  abstract import(): Promise<Package>
}
