import { LincolnOptions } from './LincolnOptions'

export function createOptions(namespace: string): LincolnOptions {
  return { namespace, namespaceSeparator: ':' }
}
