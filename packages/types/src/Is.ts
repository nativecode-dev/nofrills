import { IsType } from './index'

export const Is: IsType = {
  any: (value: any): boolean => true,
  array: (value: any): boolean => (value instanceof Array) && Is.string(value) === false,
  arrayOf: (value: any[], type?: string): boolean => Is.array(value) && value
    .map((element: any) => Is[type || 'any'](element, type))
    .every((element: boolean) => element === true),
  boolean: (value: any): boolean => typeof value === 'boolean',
  date: (value: any): boolean => value instanceof Date,
  error: (value: any): boolean => value instanceof Error,
  function: (value: any): boolean => value instanceof Function,
  number: (value: any): boolean => typeof value === 'number' && Is.string(value) === false,
  object: (value: any): boolean => typeof value === 'object' && Is.array(value) === false && Is.date(value) === false,
  string: (value: any): boolean => typeof value === 'string',
}
