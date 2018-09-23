import { Package } from '../Packages'

export class PackageError extends Error {
  constructor(source: Package, message?: string) {
    super(message)
  }
}
