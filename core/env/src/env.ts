import { all } from 'deepmerge'

import { DictionaryOf } from '@nofrills/collections'
import { Is, ObjectNavigator } from '@nofrills/types'

export enum EnvOverride {
  ConfigFirst = 'config-first',
  EnvironmentFirst = 'environment-first',
}

/**
 * @deprecated Use EnvOverride, will be removed in a future version.
 */
export type EnvOverrideType = EnvOverride

export interface EnvOptions {
  env: DictionaryOf<string | undefined>
  override?: EnvOverride
  prefix: string
  sync: boolean
}

const Defaults: Partial<EnvOptions> = {
  env: process.env,
  override: EnvOverride.ConfigFirst,
  prefix: 'app',
  sync: false,
}

export interface EnvFilter {
  (path: string): boolean
}

export interface EnvTransform {
  (path: string): string
}

export class Env {
  private readonly navigator: ObjectNavigator
  private readonly options: EnvOptions

  constructor(config: object, options?: Partial<EnvOptions>) {
    this.navigator = ObjectNavigator.from(config)
    this.options = all<EnvOptions>([Defaults, options || {}])
  }

  static from(options: Partial<EnvOptions> = {}, filter?: EnvFilter, transform?: EnvTransform): Env {
    const opts = all<EnvOptions>([Defaults, options])
    const root = ObjectNavigator.from({})

    const _filter = filter ? filter : () => true
    const _transform = transform ? transform : (path: string) => path

    Object.keys(opts.env)
      .filter(key => key.toLowerCase().startsWith(`${opts.prefix}_`))
      .map(key => ({
        env: key,
        path: key
          .split('_')
          .slice(1)
          .join('.'),
      }))
      .filter(ctx => _filter(ctx.path))
      .map(ctx => ({ env: ctx.env, path: _transform(ctx.path) }))
      .forEach(ctx => root.set(ctx.path, opts.env[ctx.env]))

    return Env.merge([root.toObject()], options)
  }

  static merge(configs: object[], options?: Partial<EnvOptions>): Env {
    const config = all<EnvOptions>(configs)
    return new Env(config, options)
  }

  get prefix(): string {
    return this.options.prefix
  }

  get sync(): boolean {
    return this.options.sync
  }

  env(key: string, defaultValue?: string): string {
    const env = this.key(key)
    const value = this.options.env[env]

    if (value && Is.string(value)) {
      if (this.options.sync) {
        this.navigator.set(key, value)
      }
      return value
    }

    return defaultValue ? defaultValue : ''
  }

  key(key: string): string {
    return [this.prefix, ...key.split('.')].join('_').toUpperCase()
  }

  value(key: string, defaultValue?: string): string {
    const configFirst = this.options.override === EnvOverride.ConfigFirst

    if (configFirst) {
      const child = this.navigator.getPath(key)

      if (child && Is.string(child.value)) {
        return child.value
      }

      if (defaultValue) {
        return defaultValue
      }
    }

    return this.env(key, defaultValue)
  }

  toObject(): any {
    return this.navigator.toObject()
  }
}
