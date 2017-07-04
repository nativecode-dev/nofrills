import { Lincoln, Logger } from './Logging'
import { Is } from './Types'

const logger: Lincoln = Logger.extend('walk')

export enum WalkType {
  Array,
  Object,
}

export type WalkInterceptor = (type: WalkType, value: any, path: string[]) => any

const WalkArray = (value: any[], interceptor?: WalkInterceptor): any[] => {
  return value.map((element: any, index: number) => {
    logger.debug('WalkArray', element, index)
    if (interceptor) {
      interceptor(WalkType.Array, element, [index.toString()])
    }

    if (Is.object(element)) {
      return WalkObject(element, [], interceptor)
    } else if (Is.array(element)) {
      return WalkArray(element, interceptor)
    }
    return element
  })
}

const WalkObject = (value: any, path: string[], interceptor?: WalkInterceptor): any => {
  Object.keys(value).forEach((key: string) => {
    path.push(key)
    try {
      const current: any = value[key]

      logger.debug('WalkObject', key, current, path)

      if (interceptor) {
        interceptor(WalkType.Object, current, path)
      }

      if (Is.array(current)) {
        WalkArray(current, interceptor)
      } else if (Is.object(current)) {
        WalkObject(current, path, interceptor)
      }
    } finally {
      path.pop()
    }
  })
  return value
}

export const Walk = (value: any, interceptor?: WalkInterceptor): any => {
  if (Is.array(value)) {
    return WalkArray(value, interceptor)
  } else if (Is.object(value)) {
    return WalkObject(value, [], interceptor)
  }
  return value
}
