import { IsType } from './IsType'

export const Is: IsType = {
  any: (value: any, type?: string): boolean => true,
  array: (value: any, type?: string): boolean => value instanceof Array && Is.string(value) === false,
  arrayOf: (value: any[], type: string = 'any'): boolean =>
    Is.array(value) &&
    value.map((element: any) => Is[type](element, type)).every((element: boolean) => element === true),
  boolean: (value: any, type?: string): boolean => typeof value === 'boolean',
  date: (value: any, type?: string): boolean => value instanceof Date,
  error: (value: any, type?: string): boolean => value instanceof Error,
  function: (value: any, type?: string): boolean => value instanceof Function,
  number: (value: any, type?: string): boolean => typeof value === 'number' && Is.string(value) === false,
  object: (value: any, type?: string): boolean =>
    typeof value === 'object' && Is.array(value) === false && Is.date(value) === false,
  string: (value: any, type?: string): boolean => typeof value === 'string',
}
