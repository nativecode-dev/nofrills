export * from './Type'
export * from './TypeParser'
export * from './TypeRegistry'

import * as validator from 'validator'
import * as zipcodes from 'zipcodes-regex'

import { Type, TypeProperties } from './Type'
import { Registry } from './TypeRegistry'

Registry.register({
  type: 'array',
  typebase: 'Array',
  validator: (value: any) => value instanceof Array,
})

Registry.register({
  type: 'boolean',
  typebase: 'Boolean',
  validator: (value: any) => typeof value === 'boolean',
})

Registry.register({
  type: 'date',
  typebase: 'Date',
  validator: (value: any) => value instanceof Date,
})

Registry.register({
  properties: {
    max: 254,
  },
  type: 'email',
  typebase: 'string',
  validator: (value: any) => {
    if (typeof value === 'string') {
      return validator.isEmail(value)
    }
    return false
  },
})

Registry.register({
  type: 'error',
  typebase: 'Error',
  validator: (value: any) => value instanceof Error,
})

Registry.register({
  type: 'number',
  typebase: 'Number',
  validator: (value: any) => typeof value === 'number',
})

Registry.register({
  type: 'object',
  typebase: 'Object',
  validator: (value: any) => value instanceof Object,
})

Registry.register({
  type: 'phone',
  typebase: 'string',
  validator: (value: any) => true,
})

Registry.register({
  properties: {
    max: 16,
    min: 5,
    nullable: true,
  },
  type: 'postalcode',
  typebase: 'string',
  validator: (value: any, country?: string) => {
    const regex: RegExp = new RegExp(zipcodes[country || 'US'])
    return regex.test(value)
  },
})

Registry.register({
  type: 'string',
  typebase: 'String',
  validator: (value: any, props?: TypeProperties) => {
    const valid: boolean = (typeof value === 'string')
    if (valid) {
      if (props && props.max && value.length > props.max) {
        return false
      } else if (props && props.min && value.length < props.min) {
        return false
      }
    }

    if (props && props.nullable && value === null) {
      return true
    }
    return valid
  },
})

Registry.register({
  type: 'timestamp',
  typebase: 'number',
  validator: (value: any) => typeof value === 'number',
})
