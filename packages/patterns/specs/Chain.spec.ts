import 'mocha'

import { expect } from 'chai'
import { Chain, ChainHandler, ChainHandlerLink } from '../src/Chain'

// tslint:disable:no-unused-expression

describe('when using Chain of Responsibilty pattern', () => {
  interface Response {
    text: string
  }

  it('should call all registered handlers', () => {
    // Arrange
    const first: ChainHandler<any, Response> = (
      object: any,
      next: ChainHandlerLink<any, Response>,
    ): Response => {
      const response: Response = next(object)
      expect(response.text).to.be.undefined
      response.text = 'first'
      return response
    }

    const second: ChainHandler<any, Response> = (
      object: any,
      next: ChainHandlerLink<any, Response>,
    ): Response => {
      const response: Response = next(object)
      expect(response.text).to.be.equal('first')
      response.text = 'second'
      return response
    }

    const third: ChainHandler<any, Response> = (
      object: any,
      next: ChainHandlerLink<any, Response>,
    ): Response => {
      const response: Response = next(object)
      expect(response.text).to.be.equal('second')
      response.text = 'third'
      return response
    }

    // Act
    const result: Response = Chain.from<any, Response>()
      .add(first)
      .add(second)
      .add(third)
      .execute({}, false, () => {
        return {} as Response
      })

    // Assert
    expect(result.text).to.be.equal('third')
  })

  it('should call all registered handlers in reverse', () => {
    // Arrange
    const first: ChainHandler<any, Response> = (
      object: any,
      next: ChainHandlerLink<any, Response>,
    ): Response => {
      const response: Response = next(object)
      expect(response.text).to.be.equal('second')
      response.text = 'first'
      return response
    }

    const second: ChainHandler<any, Response> = (
      object: any,
      next: ChainHandlerLink<any, Response>,
    ): Response => {
      const response: Response = next(object)
      expect(response.text).to.be.equal('third')
      response.text = 'second'
      return response
    }

    const third: ChainHandler<any, Response> = (
      object: any,
      next: ChainHandlerLink<any, Response>,
    ): Response => {
      const response: Response = next(object)
      expect(response.text).to.be.undefined
      response.text = 'third'
      return response
    }

    // Act
    const result: Response = Chain.from<any, Response>([
      first,
      second,
      third,
    ]).execute({}, true)

    // Assert
    expect(result.text).to.be.equal('first')
  })

  describe('chains', () => {
    // Arrange
    const prefix = (value: string, next: ChainHandlerLink<string, string>) => {
      return `PREFIX:${next(value)}`
    }

    const rename = (value: string, next: ChainHandlerLink<string, string>) =>
      next(value).replace('OBJECT', 'OBJ')

    const postfix = (value: string, next: ChainHandlerLink<string, string>) => {
      return `${next(value)}:POSTFIX`
    }

    const chains = Chain.from<string, string>([prefix, rename, postfix])

    it('should execute pipeline in order', () => {
      // Act
      const value = chains.execute('OBJECT', false, () => 'OBJECT')
      // Assert
      expect(value).to.equal('PREFIX:OBJ:POSTFIX')
    })

    it('should execute pipeline in reverse order', () => {
      // Act
      const value = chains.execute('OBJECT', true, () => 'OBJECT')
      // Assert
      expect(value).to.equal('PREFIX:OBJ:POSTFIX')
    })
  })
})
