import { Is, ObjectNavigator } from '@nofrills/types'

export enum EnvOverrideType {
  ConfigValueFirst = 'config-first',
  EnvironmentVariableFirst = 'environment-first',
}

export interface EnvOptions {
  env: { [key: string]: string | undefined }
  override?: EnvOverrideType
  prefix: string
}

const Defaults: EnvOptions = {
  env: process.env,
  override: EnvOverrideType.ConfigValueFirst,
  prefix: 'app'
}

export class Env {
  private readonly navigator: ObjectNavigator
  private readonly options: EnvOptions

  constructor(config: object, options?: Partial<EnvOptions>) {
    this.navigator = ObjectNavigator.from(config)
    this.options = Object.assign({}, Defaults, options || {})
  }

  get prefix(): string {
    return this.options.prefix
  }

  key(key: string): string {
    return [this.prefix, ...key.split('.')].join('_').toUpperCase()
  }

  value(key: string): string {
    const envFirst = this.options.override === EnvOverrideType.EnvironmentVariableFirst
    const child = this.navigator.getPath(key)

    if (child && Is.string(child.value) && envFirst === false) {
      return child.value
    }

    const env = this.key(key)
    const value = this.options.env[env]

    if (value && Is.string(value)) {
      this.navigator.set(key, value)
      return value
    }

    return ''
  }
}
