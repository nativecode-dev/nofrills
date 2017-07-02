const lincoln = require('../lib')

const EXTENSION = 'extension'
const NAMESPACE = 'nativecode:lincoln:test'
const MESSAGE = 'TEST'

module.exports = {
  EXTENSION,
  NAMESPACE,
  MESSAGE,
  options: (interceptor) => {
    return {
      interceptors: [lincoln.Console, lincoln.Debug, interceptor],
      namespace: NAMESPACE
    }
  }
}
