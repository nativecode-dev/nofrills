describe('when using lincoln interceptor', () => {
  const expect = require('chai').expect
  const interceptor = require('../lib').ScrubsInterceptor
  const scrubs = require('../lib')

  const root = require('./artifacts/data')

  it('should scrub data', () => {
    const expected_url = 'https://nobody:<secured>@nowhere.com/?apikey=<secured>&password=<secured>'
    const sut = interceptor({
      parameters: [root]
    })
    expect(sut.parameters[0].url).to.equal(expected_url)
  })
})
