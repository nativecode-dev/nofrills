import { Lincoln } from './Lincoln'
import { createOptions } from './CreateOptions'

export function createLogger(namespace: string): Lincoln {
  return new Lincoln(createOptions(namespace))
}
