export type IsType = (value: any) => boolean

export const Is: { [key: string]: any } = {
  any: (value: any): boolean => true,
  array: (value: any): boolean => {
    return (value instanceof Array)
      && Is.string(value) === false
  },
  arrayOf: (value: any[], type: string): boolean => {
    return Is.array(value) && value
      .map((element: any) => Is[type](element))
      .every((element: boolean) => element === true)
  },
  boolean: (value: any): boolean => {
    return (typeof value === 'boolean')
  },
  date: (value: any): boolean => {
    return value instanceof Date
  },
  error: (value: any): boolean => {
    return value instanceof Error
  },
  number: (value: any): boolean => {
    return typeof value === 'number'
      && Is.string(value) === false
  },
  object: (value: any): boolean => {
    return (typeof value === 'object')
      && Is.array(value) === false
      && Is.date(value) === false
  },
  string: (value: any): boolean => {
    return typeof value === 'string'
  }
}
