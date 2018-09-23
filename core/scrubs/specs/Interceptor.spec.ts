import 'mocha'

import { Log } from '@nofrills/lincoln-debug'
import { LogMessageType } from '@nofrills/lincoln'
import { expect } from 'chai'
import { data } from './data'

import { ScrubsInterceptor } from '../src/ScrubsInterceptor'

describe('when using lincoln interceptor', () => {

  it('should scrub data object', async () => {
    const expectedUrl = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'

    const log: Log = {
      id: 'test',
      namespace: 'test',
      parameters: [data],
      timestamp: Date.now(),
      type: LogMessageType.info,
    }
    const sut: Log = await ScrubsInterceptor(log)
    expect(sut.parameters[0].url).to.equal(expectedUrl)
  })

  it('should scrub data strings', async () => {
    const expectedUrl = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'

    const log: Log = {
      id: 'test',
      namespace: 'test',
      parameters: [data.url],
      timestamp: Date.now(),
      type: LogMessageType.info,
    }
    const sut: Log = await ScrubsInterceptor(log)
    expect(sut.parameters[0]).to.equal(expectedUrl)
  })

})
