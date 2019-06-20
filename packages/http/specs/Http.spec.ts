import 'mocha'

import { expect } from 'chai'

import { HttpClient } from './HttpClient'

describe('when deriving from HTTP', () => {
  it('should create new instance', () => {
    const client = new HttpClient()
    expect(client).not.equal(undefined)
  })

  it('should successfully make GET call', () => {
    const client = new HttpClient()
    expect(() => client.get<{}>('https://jsonplaceholder.typicode.com/todos/1')).to.not.throw()
  })
})
