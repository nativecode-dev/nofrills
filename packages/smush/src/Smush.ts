import merge from 'deepmerge'
import shortid from 'shortid'
import { fs } from '@nofrills/fs'

import Logger from './Logging'
import { SmushError } from './SmushError'

export class Smush {
  readonly identifier: string = shortid.generate()

  private log = Logger.extend('smush')
  private root: any = {}

  constructor() {}

  async json(key: string, filename: string, transform?: (object: any) => any): Promise<Smush> {
    await this.schema<any>(key, filename, transform)
    return this
  }

  async string(key: string, value: string, transform?: (object: any) => any): Promise<Smush> {
    try {
      const callback = transform ? transform : (obj: any) => obj
      const json: string = JSON.parse(value)
      try {
        await this.transform<any>(key, json, callback)
      } catch (error) {
        throw new SmushError(error)
      }
      return this
    } catch (error) {
      return Promise.reject(new SmushError(error))
    }
  }

  async schema<T>(key: string, filename: string, transform?: (object: T) => T): Promise<Smush> {
    const transformer = transform ? transform : (obj: T) => obj

    try {
      const buffer = await fs.readFile(filename)
      const instance = JSON.parse(buffer.toString('utf-8'))
      await this.transform<T>(key, instance, transformer)
    } catch (error) {
      throw new SmushError(error)
    }
    return this
  }

  get<T>(key: string): T {
    return this.config<T>(key)
  }

  set<T>(key: string, ...values: T[]): T {
    const config: any = this.get(key)
    const merged: any = merge.all([config, ...values])
    return this.config<T>(key, merged)
  }

  toObject(key?: string): any {
    const exported: any = {}

    Object.keys(this.root).forEach((property: string) => (exported[property] = this.root[property]))

    return key ? this.config<any>(key) : exported
  }

  private async transform<T>(key: string, object: T, transform: (object: T) => T): Promise<T> {
    const transformed = transform(object)
    this.set<T>(key, transformed)
    this.log.debug(transformed)

    return transformed
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
    parts.forEach((part: string) => (current = current[part] || {}))
    return current
  }
}
