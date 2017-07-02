import { merge } from 'lodash'

import * as logging from '@nofrills/lincoln'

const logOptions: logging.Options = {
  interceptors: [logging.Debug],
  namespace: 'nativecode:scrubs'
}

const logger: logging.Lincoln = new logging.Lincoln(logOptions)

export enum Scope {
  None,
  Scrubbed,
}

export interface Change {
  original: any
  path: string[]
  value: any
}

export interface Context {
  current: any
  path: string[]
}

export type Scrubber = (key: string, context: Context) => any

export interface Options {
  secured: {
    properties: string[]
    values: RegExp[]
  }
}

const defaults: Options = {
  secured: {
    properties: ['apikey', 'api_key', 'password'],
    values: [
      /(http[s]:\/\/\w+:)\w+(@.*)/g,
      new RegExp('([apikey|api_key|password]=[\'"]?)\\w+([\'"]?&?)', 'g'),
    ]
  }
}

export class Scrubs {
  private readonly changes: Change[]
  private readonly log: logging.Lincoln
  private readonly object: any
  private readonly options: Options

  constructor(object: any, options?: Options) {
    this.changes = []
    this.log = logger.extend('Scrubs')
    this.object = object
    this.options = merge({}, options || {}, defaults)

    this.enumerate({ current: object, path: [] })
  }

  public clean(): any {
    const clone: any = this.clone()

    if (this.changes.length) {
      for (const change of this.changes) {
        this.set(clone, change)
      }
    }
    this.log.debug('clean', clone)
    return clone
  }

  public clone(): any {
    this.log.debug('clone', this.object)
    return merge({}, this.object)
  }

  private enumerate(context: Context): void {
    Object.keys(context.current)
      .forEach((key: string) => {
        const current: any = context.current[key]
        const path: string[] = context.path.concat([key])

        const name: string = key.toLowerCase()
        const properties = this.options.secured.properties
        const regexes = this.options.secured.values

        switch (typeof current) {
          case 'object':
            this.enumerate({ current, path })
            break;
          case 'string':
            if (properties.indexOf(name) >= 0) {
              this.changes.push({
                original: current,
                path,
                value: '<secured>',
              })
            } else {
              let transformed: string = current
              regexes.forEach((regex) => (transformed = transformed.replace(regex, '$1<secured>$2')))
              this.changes.push({
                original: current,
                path,
                value: transformed,
              })
            }
            break;
          default:
            this.log.debug(path.join('.'), current)
            break;
        }
      })
  }

  private set(clone: any, change: Change): void {
    let current: any = clone
    for (let index: number = 0; index < change.path.length; index++) {
      const name: string = change.path[index]

      if (index === change.path.length - 1) {
        current[name] = change.value
      } else {
        current = current[name]
      }
    }
  }
}

const helpers = {
  array: (dirties: any[], options?: Options): any[] => {
    const scrubbed: any[] = []
    for (const dirty of dirties) {
      const scrubber = new Scrubs(dirty, options)
      scrubbed.push(scrubber.clean())
    }
    return scrubbed
  },

  object: (value: object, options?: Options): object => {
    const scrubber: Scrubs = new Scrubs(value, options)
    return scrubber.clean()
  },

  str: (value: string, options?: Options): string => {
    return value
  },
}

export const scrub = (value: any, options?: Options): any => {
  switch (typeof value) {
    case 'string':
      return helpers.str(value, options)

    case 'boolean':
    case 'function':
    case 'number':
    case 'symbol':
    case 'undefined':
      return value

    default:
      if (value instanceof Date) {
        return value
      }
      return helpers.object(value, options)
  }
}
