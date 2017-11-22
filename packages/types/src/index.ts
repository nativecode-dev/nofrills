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

const phone = (): RegExp => {
  return /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
}

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
  validator: (value: any) => {
    if (Is.string(value)) {
      return validator.isEmail(value)
    }
    return false
  },
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
  validator: (value: any, props?: TypeProperties, country?: string) => {
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
  validator: (value: any, props?: TypeProperties) => {
    const valid: boolean = Is.string(value)

    if (valid === false && props && props.required) {
      return false
    } else if (value) {
      if (props && props.max && value.length > props.max) {
        return false
      } else if (props && props.min && value.length < props.min) {
        return false
      }
    }
    return valid
  },
})

Types.register({
  type: 'timestamp',
  typebase: 'number',
  validator: (value: any) => Is.number(value),
})
