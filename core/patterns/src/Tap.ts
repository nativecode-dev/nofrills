export interface TapAfter<T> {
  after(action: Function): Promise<T>
}

export function Tap<T>(promise: Promise<T>): TapAfter<T> {
  return {
    after: (action: Function) => {
      return Promise.resolve(action).then(() => promise)
    },
  }
}
