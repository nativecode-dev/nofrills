const collections = require('@nofrills/collections')

const lincoln = require('../lib')

const EXTENSION = 'extension'
const NAMESPACE = 'nativecode:lincoln:test'
const MESSAGE = 'TEST'

module.exports = {
  EXTENSION,
  NAMESPACE,
  MESSAGE,
  options: (interceptor) => {
    const options = {
      filters: new collections.Registry(),
      interceptors: new collections.Registry(),
      namespace: NAMESPACE
    }
    options.interceptors.register('test', interceptor)
    return options
  }
}
