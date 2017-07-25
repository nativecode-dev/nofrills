import * as mocha from 'mocha'

import { Log } from '@nofrills/lincoln-debug'
import { expect } from 'chai'
import { data } from './artifacts/data'

import { Scrubs, ScrubsInterceptor } from '../src/index'

describe('when using lincoln interceptor', () => {
  it('should scrub data', () => {
    const expectedUrl: string = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
    const options: Log = {
      id: 'test',
      namespace: 'test',
      parameters: [data],
      timestamp: Date.now(),
    }
    const sut: Log = ScrubsInterceptor(options)
    expect(sut.parameters[0].url).to.equal(expectedUrl)
  })
})
