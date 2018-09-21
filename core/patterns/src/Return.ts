export function Return<T>(value: T) {
  return {
    after: (callback: Function) => {
      callback()
      return value
    },
  }
}
