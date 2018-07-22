import { URL } from 'url'

import { Class } from './Packages'

export abstract class Provider {
  constructor(protected readonly url: URL) { }
  abstract classes(): Promise<Class[]>
}
