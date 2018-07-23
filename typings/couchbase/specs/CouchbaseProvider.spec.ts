import 'mocha'

import { expect } from 'chai'

import { CouchbaseProvider } from '../src/CouchbaseProvider'

describe('when importing couchbase documentation', () => {

  it('should get list of classes', async () => {
    const sut = new CouchbaseProvider()
    const pkg = await sut.import()
    console.log(pkg)
    expect(pkg).not.equal(undefined)
  })

})
