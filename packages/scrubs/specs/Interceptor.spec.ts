import 'mocha'

import { Log } from '@nofrills/lincoln-debug'
import { expect } from 'chai'
import { data } from '../artifacts/data'

import { ScrubsInterceptor } from '../src/index'
import { LogMessageType } from '@nofrills/lincoln'

describe('when using lincoln interceptor', () => {

  it('should scrub data object', () => {
    const expectedUrl: string = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
    const options: Log = {
      id: 'test',
      namespace: 'test',
      parameters: [data],
      timestamp: Date.now(),
      type: LogMessageType.info,
    }
    const sut: Log = ScrubsInterceptor(options)
    expect(sut.parameters[0].url).to.equal(expectedUrl)
  })

  it('should scrub data strings', () => {
    const expectedUrl: string = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
    const options: Log = {
      id: 'test',
      namespace: 'test',
      parameters: [data.url],
      timestamp: Date.now(),
      type: LogMessageType.info,
    }
    const sut: Log = ScrubsInterceptor(options)
    expect(sut.parameters[0]).to.equal(expectedUrl)
  })

})
