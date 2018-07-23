import { Package } from './Packages'
import { Logger } from './Logger'

export abstract class Provider {
  protected readonly package: Package

  protected readonly baselog = Logger.extend('provider')

  constructor(name: string) {
    this.package = { name, namespaces: {} }
  }

  abstract import(): Promise<Package>
}
