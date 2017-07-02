export * from './Lincoln'

import * as interceptors from './Interceptors'

export const Interceptors: any = {
  Console: interceptors.Console,
  Debug: interceptors.Debug,
}
