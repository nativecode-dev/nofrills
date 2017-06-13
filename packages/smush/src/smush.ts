import { merge } from 'lodash'
import * as Promise from 'bluebird'
import * as fs from 'fs'

export class Smush {
  private configurations: any = {}
  private reader = Promise.promisify(fs.readFile)
  private writer = Promise.promisify(fs.writeFile)

  clear(key: string): void {
    delete this.configurations[key]
  }

  json(key: string, filename: string): Promise<Smush> {
    const self = this
    const config = this.get(key)

    return this.reader(filename)
      .then((buffer: Buffer) => JSON.parse(buffer.toString()))
      .then((object: any) => self.set(key, object))
      .then(() => self)
  }

  get(key: string): any {
    return this.config(key)
  }

  set(key: string, ...values: any[]): any {
    const config = this.get(key)
    const merged = merge({}, config, ...values)
    return this.config(key, merged)
  }

  toObject(): any {
    let exported: any = {}

    Object.keys(this.configurations)
      .forEach(key => exported[key] = this.configurations[key])

    return exported
  }

  private config(key: string, value?: any): any {
    const parts: string[] = key.split('.')

    if (parts.length === 1) {
      return (this.configurations[key] = value || {})
    }

    return this.path(parts)
  }

  private path(parts: string[]): any {
    let current = this.configurations
    parts.forEach(part => current = current[part] || {})
    return current
  }
}

export default () => new Smush()
