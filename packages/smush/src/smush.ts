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

  json(key: string, filename: string, transform?: (object: any) => any): Promise<Smush> {
    return this.schema<any>(key, filename, transform ? transform : object => object)
  }

  schema<T>(key: string, filename: string, transform?: (object: T) => T): Promise<Smush> {
    const self: Smush = this
    const config: any = this.get(key)

    return this.reader(filename)
      .then((buffer: Buffer) => JSON.parse(buffer.toString()))
      .then((object: T) => transform ? transform(object) : object)
      .then((object: T) => self.set<T>(key, object))
      .then((object: T) => console.info(`[json@${key}]`, filename, object))
      .then(() => self)
  }

  get<T>(key: string): T {
    return this.config<T>(key)
  }

  set<T>(key: string, ...values: T[]): T {
    const config: any = this.get(key)
    const merged: any = merge({}, config, ...values)
    return this.config<T>(key, merged)
  }

  toObject(key?: string): any {
    let exported: any = {}

    Object.keys(this.configurations)
      .forEach(key => exported[key] = this.configurations[key])

    return key ? this.config(key) : exported
  }

  private config<T>(key: string, value?: T): T {
    const parts: string[] = key.split('.')

    if (parts.length === 1 && value) {
      return (this.configurations[key] = value)
    }

    return this.path(parts)
  }

  private path(parts: string[]): any {
    let current: any = this.configurations
    parts.forEach(part => current = current[part] || {})
    return current
  }
}
