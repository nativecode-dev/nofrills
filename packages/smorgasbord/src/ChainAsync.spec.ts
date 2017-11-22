import { expect } from 'chai'
import { ChainAsync, ChainAsyncHandler, ChainAsyncHandlerLink } from './ChainAsync'

// tslint:disable:no-unused-expression

describe('when using Chain of Responsibilty pattern', async () => {
  interface Response {
    text: string
  }

  it('should call all registered handlers', async () => {
    // Arrange
    const first: ChainAsyncHandler<any, Response> =
      await (async (object: any, next: ChainAsyncHandlerLink<any, Response>): Promise<Response> => {
        const response: Response = await next(object)
        expect(response.text).to.be.equal('')
        response.text = 'first'
        return response
      })

    const second: ChainAsyncHandler<any, Response> =
      await (async (object: any, next: ChainAsyncHandlerLink<any, Response>): Promise<Response> => {
        const response: Response = await next(object)
        expect(response.text).to.be.equal('first')
        response.text = 'second'
        return response
      })

    const third: ChainAsyncHandler<any, Response> =
      await (async (object: any, next: ChainAsyncHandlerLink<any, Response>): Promise<Response> => {
        const response: Response = await next(object)
        expect(response.text).to.be.equal('second')
        response.text = 'third'
        return response
      })

    // Act
    const result: Response = await new ChainAsync<any, Response>()
      .add(first)
      .add(second)
      .add(third)
      .execute({}, () => Promise.resolve({ text: '' }))

    // Assert
    expect(result.text).to.be.equal('third')
  })

  it('should call all registered handlers in reverse', async () => {
    // Arrange
    const first: ChainAsyncHandler<any, Response> =
      await (async (object: any, next: ChainAsyncHandlerLink<any, Response>): Promise<Response> => {
        const response: Response = await next(object)
        expect(response.text).to.be.equal('second')
        response.text = 'first'
        return response
      })

    const second: ChainAsyncHandler<any, Response> =
      await (async (object: any, next: ChainAsyncHandlerLink<any, Response>): Promise<Response> => {
        const response: Response = await next(object)
        expect(response.text).to.be.equal('third')
        response.text = 'second'
        return response
      })

    const third: ChainAsyncHandler<any, Response> =
      await (async (object: any, next: ChainAsyncHandlerLink<any, Response>): Promise<Response> => {
        const response: Response = await next(object)
        expect(response.text).to.be.equal('')
        response.text = 'third'
        return response
      })

    // Act
    const result: Response = await (new ChainAsync<any, Response>(...[first, second, third])
      .execute({}, () => Promise.resolve(({ text: '' })), true))

    // Assert
    expect(result.text).to.be.equal('first')
  })
})
