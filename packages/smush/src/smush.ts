import * as Promise from 'bluebird'
import * as fs from 'fs'
import * as shortid from 'shortid'

import { Lincoln } from '@nofrills/lincoln'
import { merge } from 'lodash'

import { Logger } from './Logging'
import { SmushError } from './SmushError'

export class Smush {
  private readonly identifier: string = shortid.generate()

  private log: Lincoln
  private reader = Promise.promisify(fs.readFile)
  private root: any = {}
  private writer = Promise.promisify(fs.writeFile)

  constructor() {
    this.log = Logger.extend('Smush')
  }

  public clear(key: string): void {
    this.log.debug('clear', key)
    delete this.root[key]
  }

  public json(key: string, filename: string, transform?: (object: any) => any): Promise<Smush> {
    return this.schema<any>(key, filename, transform ? transform : (obj: any) => obj)
      .then(() => this)
  }

  public string(key: string, value: string, transform?: (object: any) => any): Promise<Smush> {
    return this.transform<any>(key, JSON.parse(value), transform ? transform : (obj: any) => obj)
      .catch((error: Error) => { throw new SmushError(error) })
      .then(() => this)
  }

  public schema<T>(key: string, filename: string, transform?: (object: T) => T): Promise<Smush> {
    const config: any = this.get(key)

    return this.reader(filename)
      .then((buffer: Buffer) => JSON.parse(buffer.toString('utf-8')))
      .then((object: T) => this.transform<T>(key, object, transform))
      .catch((error: Error) => { throw new SmushError(error) })
      .then(() => this)
  }

  public get<T>(key: string): T {
    return this.config<T>(key)
  }

  public set<T>(key: string, ...values: T[]): T {
    const config: any = this.get(key)
    const merged: any = merge({}, config, ...values)
    return this.config<T>(key, merged)
  }

  public toObject(key?: string): any {
    const exported: any = {}

    Object.keys(this.root)
      .forEach((property: string) => exported[property] = this.root[property])

    return key ? this.config<any>(key) : exported
  }

  private transform<T>(key: string, object: T, transform?: (object: T) => T): Promise<T> {
    return Promise.resolve(object)
      .tap((obj: T) => transform ? transform(obj) : obj)
      .tap((obj: T) => this.set<T>(key, obj))
      .tap((obj: T) => this.log.info(obj))
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
    parts.forEach((part: string) => current = current[part] || {})
    return current
  }
}
