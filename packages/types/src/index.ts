export * from './Is'
export * from './IsType'
export * from './IsTypeHandler'
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

Types.register({
  default: 'max',
  type: 'array',
  typebase: 'Array',
  validator: (value: any) => Is.array(value),
})

Types.register({
  type: 'boolean',
  typebase: 'Boolean',
  validator: (value: any) => Is.boolean(value),
})

Types.register({
  type: 'date',
  typebase: 'Date',
  validator: (value: any) => Is.date(value),
})

Types.register({
  default: 'max',
  properties: {
    max: 254,
  },
  type: 'email',
  typebase: 'string',
  validator: (value: any) => Is.string(value) ? validator.isEmail(value) : false,
})

Types.register({
  type: 'error',
  typebase: 'Error',
  validator: (value: any) => Is.error(value),
})

Types.register({
  default: 'max',
  type: 'number',
  typebase: 'Number',
  validator: (value: any) => Is.number(value),
})

Types.register({
  type: 'object',
  typebase: 'Object',
  validator: (value: any) => Is.object(value),
})

Types.register({
  type: 'phone',
  typebase: 'string',
  validator: (value: any) => phone().test(value),
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
      return regex.test(value)
    }
    return false
  },
})

Types.register({
  default: 'max',
  type: 'string',
  typebase: 'String',
  validator: (value: any, props?: TypeProperties): boolean => {
    const valid: boolean = Is.string(value)

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

const timestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  const max = new Date('2038-01-19 03:14:07')
  const min = new Date('1970-01-01 00:00:01')
  return date > min && date < max
}

Types.register({
  properties: {
    max: 8640000000000000,
    min: -8640000000000000,
    required: true,
  },
  type: 'timestamp',
  typebase: 'number',
  validator: (value: any) => Is.number(value) && timestamp(value),
})
