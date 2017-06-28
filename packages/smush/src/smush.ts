import { merge } from 'lodash'

import * as fs from 'fs'
import * as shortid from 'shortid'
import * as vcr from '@nofrills/vcr'
import * as Promise from 'bluebird'

export class SmushError extends Error {
  private readonly error: Error

  constructor(error: Error, message?: string) {
    super(message || error.message)
    this.error = error
  }
}

export class Smush {
  private readonly identifier: string = shortid.generate()

  private log: vcr.VCR
  private reader = Promise.promisify(fs.readFile)
  private root: any = {}
  private writer = Promise.promisify(fs.writeFile)

  constructor() {
    this.log = new vcr.VCR(`nativecode:smush:[${this.identifier}]`)
      .use(vcr.Debug)
  }

  clear(key: string): void {
    this.log.debug('clear', key)
    delete this.root[key]
  }

  json(key: string, filename: string, transform?: (object: any) => any): Promise<Smush> {
    return this.schema<any>(key, filename, transform ? transform : object => object)
      .then(() => this)
  }

  string(key: string, value: string, transform?: (object: any) => any): Promise<Smush> {
    return this.transform<any>(key, JSON.parse(value), transform ? transform : object => object)
      .catch(error => { throw new SmushError(error) })
      .then(() => this)
  }

  schema<T>(key: string, filename: string, transform?: (object: T) => T): Promise<Smush> {
    const config: any = this.get(key)

    return this.reader(filename)
      .then((buffer: Buffer) => JSON.parse(buffer.toString('utf-8')))
      .then((object: T) => this.transform<T>(key, object, transform))
      .catch(error => { throw new SmushError(error) })
      .then(() => this)
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

    Object.keys(this.root)
      .forEach(key => exported[key] = this.root[key])

    return key ? this.config<any>(key) : exported
  }

  private transform<T>(key: string, object: T, transform?: (object: T) => T): Promise<T> {
    return Promise.resolve(object)
      .tap((object: T) => transform ? transform(object) : object)
      .tap((object: T) => this.set<T>(key, object))
      .tap((object: T) => this.log.info(object))
  }

  private config<T>(key: string, value?: T): T {
    const parts: string[] = key.split('.')

    if (parts.length === 1 && value) {
      return (this.root[key] = value)
    }

    return this.path(parts)
  }

  private path(parts: string[]): any {
    let current: any = this.root
    parts.forEach(part => current = current[part] || {})
    return current
  }
}
