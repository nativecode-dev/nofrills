import { URL } from 'url'

import { Class } from './Packages'

export abstract class ImportReader {
  constructor(protected readonly url: URL) { }
  abstract classes(): Promise<Class[]>
}
