import 'mocha'

import expect from './expect'

import { Env, EnvOverrideType } from '../src/env'

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
    const env = new Env(Overrides)
    expect(env.key('runtime.data.database')).to.equal(
      'APP_RUNTIME_DATA_DATABASE',
    )
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
      override: EnvOverrideType.EnvironmentFirst,
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
      override: EnvOverrideType.EnvironmentFirst,
    })

    expect(env.value('version')).to.equal('2.0.0')
  })

  it('should convert environment variables to object', () => {
    const env = Env.from({ env: ENV })
    const config = env.toObject()
    console.log(config)
    expect(config.CONFIG.PROJECT).to.equal('package.json')
    expect(config.CONFIG.TYPESCRIPT).to.equal('tsconfig.json')
  })
})
