export interface ReturnsAfter<T> {
  after: (callback: Function) => T
}

export function Returns<T>(value: T): ReturnsAfter<T> {
  return {
    after: (callback: Function): T => {
      callback()
      return value
    },
  }
}
