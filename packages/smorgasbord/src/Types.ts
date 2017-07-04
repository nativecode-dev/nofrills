export const Is: any = {
  array: (value: any): boolean => {
    return (value instanceof Array)
      && Is.string(value) === false
  },
  boolean: (value: any): boolean => {
    return (typeof value === 'boolean')
  },
  date: (value: any): boolean => {
    return value instanceof Date
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
