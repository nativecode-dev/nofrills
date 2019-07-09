import 'mocha'

import expect from './expect'

import { Env } from '../src/env'
import { EnvOverride } from '../src/EnvOverride'
import { EnvCaseOptions } from '../src/EnvOptions'

interface ConfigOptions {
  runtime: {
    data: {
      database: string
      host?: string
      credentials: {
        username?: string
        password?: string
      }
    }
    server: {
      port: number
    }
  }
  version: string
}

describe('when using env', () => {
  const Defaults = (): Partial<ConfigOptions> => ({
    runtime: {
      data: {
        database: ':memory:',
        credentials: {},
      },
      server: {
        port: 3000,
      },
    },
    version: '1.0.0',
  })

  const Overrides = (): Partial<ConfigOptions> => ({
    runtime: {
      data: {
        database: 'test',
        host: 'localhost',
        credentials: {
          username: 'root',
          password: 'root-password',
        },
      },
      server: {
        port: 80,
      },
    },
  })

  const ENV = {
    APP_CONFIG_PROJECT: 'package.json',
    APP_CONFIG_TYPESCRIPT: 'tsconfig.json',
    APP_VERSION: '2.0.0',
  }

  it('should return merged configuration', () => {
    const env = Env.merge([Defaults(), Overrides()])
    const config = env.toObject()
    expect(config.version).to.equal('1.0.0')
  })

  it('should return environment variable name', () => {
    const env = new Env(Overrides())
    expect(env.key('runtime.data.database')).to.equal('APP_RUNTIME_DATA_DATABASE')
  })

  it('should return empty string for variables that do not exist', () => {
    const env = Env.merge([Defaults(), Overrides()], { env: ENV })
    expect(env.value('runtime.etcd.host')).to.equal('')
  })

  it('should return default value for variables that do not exist', () => {
    const env = Env.merge([Defaults(), Overrides()], { env: ENV })
    expect(env.value('runtime.etcd.host', 'devbox')).to.equal('devbox')
  })

  it('should return default value for variables that do not exist using environment first', () => {
    const env = Env.merge([Defaults(), Overrides()], {
      env: ENV,
      override: EnvOverride.EnvironmentFirst,
    })
    expect(env.value('runtime.etcd.host', 'devbox')).to.equal('devbox')
  })

  it('should get nested configuration object value', () => {
    const env = Env.merge([Defaults(), Overrides()], { env: ENV })
    expect(env.value('runtime.data.database')).to.equal('test')
  })

  it('should return config variable first', () => {
    const env = Env.merge([Defaults(), Overrides()], { env: ENV })
    expect(env.value('version')).to.equal('1.0.0')
  })

  it('should return environment variable first', () => {
    const env = Env.merge([Defaults(), Overrides()], {
      env: ENV,
      override: EnvOverride.EnvironmentFirst,
    })

    expect(env.value('version')).to.equal('2.0.0')
  })

  it('should convert environment variables to object', () => {
    const env = Env.from({ env: ENV })
    const config = env.toObject()
    expect(config.CONFIG.PROJECT).to.equal('package.json')
    expect(config.CONFIG.TYPESCRIPT).to.equal('tsconfig.json')
    expect(config.VERSION).to.equal('2.0.0')
  })

  it('should filter environment variables', () => {
    const env = Env.from({ env: ENV }, name => !name.startsWith('VERSION'))
    const config = env.toObject()
    expect(config.VERSION).to.be.undefined
  })

  it('should transform environment variables', () => {
    const env = Env.from({ env: ENV }, undefined, name => name.toLowerCase())
    const config = env.toObject()
    expect(config.version).to.equal('2.0.0')
  })

  it('should lowercase path', () => {
    const env = Env.from({ casing: EnvCaseOptions.LowerCase, env: ENV })
    const config = env.toObject()
    expect(config.config.project).to.equal('package.json')
  })

  it('should camelize key names', () => {
    const env = Env.from({ casing: EnvCaseOptions.CamelCase, env: ENV })
    const config = env.toObject()
    expect(config.configProject).to.equal('package.json')
  })

  it('should pascalize key names', () => {
    const env = Env.from({ casing: EnvCaseOptions.PascalCase, env: ENV })
    const config = env.toObject()
    expect(config.ConfigProject).to.equal('package.json')
  })
})
