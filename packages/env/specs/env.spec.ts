import 'mocha'

import expect from './expect'

import { EnvOptions, Env } from '../src/env'

describe('when using env', () => {
  const createConfig = () => ({
    ENVIRONMENT: 'testing',
    NAME: 'app'
  })

  const options: EnvOptions = {
    env: {},
    prefix: 'env'
  }

  it('should convert object key to environment variable', () => {
    const config = createConfig()
    const env = new Env(config, options)
    expect(env.key('environment')).to.equal('ENV_ENVIRONMENT')
  })

  it('should get environment value', () => {
    const config = createConfig()
    const env = new Env(config, options)
    const value = env.value('NAME')
    expect(value).to.equal(config.NAME)
    expect(config.NAME).to.equal(value)
  })
})
