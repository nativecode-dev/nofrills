export interface PromisifyCallback {
  (error?: Error, ...args: any[]): void
}

export interface PromisifyHandler {
  (callback: PromisifyCallback): void
}

export interface PromisifyResolver {
  (resolve: Function, reject: Function, ...args: any[]): void
}

export function Promisify<T>(handler: PromisifyHandler, resolver?: PromisifyResolver): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    handler((error?: Error, ...args: any[]) => {
      if (error) {
        reject(error)
      }

      if (resolver) {
        resolver(resolve, reject, ...args)
      } else {
        resolve(...args)
      }
    })
  })
}
