import { merge } from 'lodash'

import * as vcr from '@nofrills/vcr'

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

export interface Scrubber {
  (key: string, context: Context): any
}

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
  private readonly log: vcr.VCR
  private readonly object: any
  private readonly options: Options

  constructor(object: any, options?: Options) {
    this.changes = []
    this.log = new vcr.VCR('nativecode:scrubs').use(vcr.Debug)
    this.object = object
    this.options = merge({}, options || {}, defaults)

    this.enumerate({ current: object, path: [] })
  }

  public clean(): any {
    const clone: any = this.clone()

    if (this.changes.length) {
      for (let index: number = 0; index < this.changes.length; index++) {
        const change: Change = this.changes[index]
        this.set(clone, change)
      }
    }

    return clone
  }

  public clone(): any {
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
              regexes.forEach(regex => transformed = transformed.replace(regex, '$1<secured>$2'))
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
