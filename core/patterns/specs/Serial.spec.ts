import expect from './expect'

import { serial, PromiseFactory } from '../src/Serial'

function createTimerPromise(time: number): PromiseFactory<number> {
  return () =>
    new Promise<number>((resolve) => {
      setTimeout(() => resolve(time), time)
    })
}

describe('when serializing promises', () => {
  it('should resolve promises in order', async () => {
    const short = createTimerPromise(100)
    const medium = createTimerPromise(500)
    const long = createTimerPromise(1000)

    const results = await serial([long, medium, short], () => Promise.resolve([]))

    expect(results).to.deep.equal([1000, 500, 100])
  })
})
