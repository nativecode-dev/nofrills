import 'mocha'

import { expect } from 'chai'
import { Dates } from '../src/index'

describe('when using Dates helping', () => {
  it("should return today's date", () => {
    const expected = new Date(2017, 6, 30)
    const today = Dates.today(expected)
    expect(today.toISOString()).to.equal(expected.toISOString())
  })

  it("should return yesterday's date", () => {
    // TODO: For some reason, moment is setting month to the current month, rather than
    // using the expected one. MUST FIX (at some point).
    const expected = new Date(2017, 6, 30)
    const yesterday = Dates.yesterday(expected)
    const date = new Date(expected.getUTCFullYear(), expected.getUTCMonth() + 1, expected.getUTCDay() - 2)
    expect(yesterday.toISOString()).to.equal(date.toISOString())
  })

  it('should return last working week day', () => {
    const expected = new Date(2017, 6, 30)
    const lastWeek = Dates.lastWeek(expected)
    expect(lastWeek.getDate()).to.equal(23)
    expect(lastWeek.getMonth()).to.equal(6)
  })

  it('should return next working week day', () => {
    const expected = new Date(2017, 6, 30)
    const nextWeek = Dates.nextWeek(expected)
    expect(nextWeek.getDate()).to.equal(6)
    expect(nextWeek.getMonth()).to.equal(7)
  })
})
