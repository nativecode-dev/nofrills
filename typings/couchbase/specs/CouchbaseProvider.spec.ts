import 'mocha'

import { expect } from 'chai'

import { CouchbaseProvider } from '../src/CouchbaseProvider'

describe('when importing couchbase documentation', () => {

  it.skip('should get list of classes', async () => {
    const sut = new CouchbaseProvider()
    const classes = await sut.classes()
    console.log(classes)
    expect(classes.length).gt(0)
  })

})
