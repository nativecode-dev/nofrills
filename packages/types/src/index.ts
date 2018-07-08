export * from './Is'
export * from './IsType'
export * from './IsTypeHandler'
export * from './ObjectParentIterator'
export * from './ObjectNavigator'
export * from './ObjectPath'
export * from './Type'
export * from './TypeParser'
export * from './TypeProperties'
export * from './TypeRegistry'
export * from './Types'
export * from './TypeValidator'

import * as validator from 'validator'
import * as zipcodes from 'zipcodes-regex'

import { Is } from './Is'
import { TypeProperties } from './TypeProperties'
import { Types } from './Types'

const phone = (): RegExp => /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i

class $ {
  public static readonly MaxDate: Date = new Date('2038-01-19 03:14:07')

  public static readonly MinDate: Date = new Date('1970-01-01 00:00:01')

  public static bounded(value: number, props?: TypeProperties): boolean {
    return $.clamped(value, props) === value
  }

  public static clamped(value: number, props?: TypeProperties): number {
    if (props && props.max && value > props.max) {
      return props.max
    }

    if (props && props.min && value < props.min) {
      return props.min
    }

    return value
  }

  public static consumed(value: any, props?: TypeProperties): boolean {
    return !value && props && props.required ? false : true
  }

  public static timestamp(timestamp: number): boolean {
    const date = new Date(timestamp)
    const max = $.MaxDate
    const min = $.MinDate
    return date > min && date < max
  }
}

Types.register({
  default: 'max',
  type: 'array',
  typebase: 'Array',
  validator: (value: any, props?: TypeProperties) => Is.array(value) && $.consumed(value, props),
})

Types.register({
  type: 'boolean',
  typebase: 'Boolean',
  validator: (value: any, props?: TypeProperties) => Is.boolean(value) && $.consumed(value, props),
})

Types.register({
  type: 'date',
  typebase: 'Date',
  validator: (value: any, props?: TypeProperties) => Is.date(value) && $.consumed(value, props),
})

Types.register({
  default: 'max',
  properties: {
    max: 254,
  },
  type: 'email',
  typebase: 'string',
  validator: (value: any, props?: TypeProperties) => Is.string(value) && $.consumed(value, props) ? validator.isEmail(value) : false,
})

Types.register({
  type: 'error',
  typebase: 'Error',
  validator: (value: any, props?: TypeProperties) => Is.error(value) && $.consumed(value, props),
})

Types.register({
  default: 'max',
  type: 'number',
  typebase: 'Number',
  validator: (value: any, props?: TypeProperties) => Is.number(value) && $.consumed(value, props) && $.bounded(value, props),
})

Types.register({
  properties: {
    required: true,
  },
  type: 'object',
  typebase: 'Object',
  validator: (value: any, props?: TypeProperties) => Is.object(value) && $.consumed(value, props),
})

Types.register({
  properties: {
    max: 64,
    required: true,
  },
  type: 'phone',
  typebase: 'string',
  validator: (value: any, props?: TypeProperties) => phone().test(value) && $.consumed(value, props),
})

Types.register({
  properties: {
    max: 16,
    min: 5,
    required: true,
  },
  type: 'postalcode',
  typebase: 'string',
  validator: (value: any, props?: TypeProperties, country?: string): boolean => {
    if (Is.string(value)) {
      const pattern: string = zipcodes[country || 'US']
      const regex: RegExp = new RegExp(pattern)
      return regex.test(value) && $.consumed(value, props)
    }
    return false
  },
})

Types.register({
  default: 'max',
  type: 'string',
  typebase: 'String',
  validator: (value: any, props?: TypeProperties): boolean => {
    const valid: boolean = Is.string(value) && $.consumed(value, props)

    if (valid === false && props && props.required) {
      return false
    }

    if (!value) {
      return valid
    }

    if (props && props.max && value.length > props.max) {
      return false
    } else if (props && props.min && value.length < props.min) {
      return false
    }

    return valid
  },
})

Types.register({
  type: 'null',
  typebase: 'null',
  validator: (value: any) => value === null,
})

Types.register({
  type: 'undefined',
  typebase: 'undefined',
  validator: (value: any) => value === undefined,
})

Types.register({
  properties: {
    max: 8640000000000000,
    min: -8640000000000000,
    required: true,
  },
  type: 'timestamp',
  typebase: 'number',
  validator: (value: any, props?: TypeProperties) => Is.number(value) && $.consumed(value, props) && $.timestamp(value),
})
