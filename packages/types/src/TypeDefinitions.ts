import * as vcr from '@nofrills/vcr'
import * as validator from 'validator'

import zipcodes = require('zipcodes-regex')

import { TypeDefinition } from './TypeDefinition'

const log: vcr.VCR = new vcr.VCR(`nativecode:bluprint:types`).use(vcr.Debug)

interface TypeDefinitions {
  [key: string]: TypeDefinition
}

const PATTERN = {
  PHONE: `^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$`,
  URI: `(?:(\w+):\/\/)(?:(\w+:['"]?\w+?['"]?)@)?([\w\-\.]+)+(\/[\w\/]+\/?)?(?:[\/\?]?([\w\=\&'"]+)?)`,
}

const validate = (value: string, regex: string, flags?: string | undefined): boolean => {
  const regexp = new RegExp(regex, flags)
  log.debug(regex, flags)
  return regexp.test(value)
}

const TypeDefinitions: TypeDefinitions = {
  array: {
    nullable: true,
    property: 'max',
    type: 'Array',
  },
  base64: {
    nullable: true,
    type: 'Base64',
    validator: (value: string) => validator.isBase64(value),
  },
  boolean: {
    nullable: true,
    type: 'Boolean',
  },
  date: {
    default: () => new Date(),
    nullable: true,
    type: 'Date',
  },
  email: {
    max: 4096,
    min: 6,
    nullable: true,
    property: 'max',
    type: 'email',
    typebase: 'string',
    validator: (value: string) => validator.isEmail(value),
  },
  error: {
    nullable: true,
    type: 'Error',
    validator: (value: Error) => (value instanceof Error),
  },
  function: {
    nullable: true,
    type: 'Function',
  },
  number: {
    nullable: true,
    type: 'Number',
  },
  object: {
    nullable: true,
    type: 'Object',
  },
  phone: {
    max: 32,
    min: 8,
    nullable: true,
    type: 'phone',
    typebase: 'string',
    validator: (value: string) => validate(value, PATTERN.PHONE, 'i'),
  },
  postalcode: {
    nullable: true,
    type: 'postalcode',
    typebase: 'string',
    validator: (value: string, country?: string) => validate(value, zipcodes[country || 'US'])
  },
  regex: {
    nullable: true,
    type: 'RegExp',
  },
  string: {
    nullable: true,
    property: 'max',
    type: 'String',
  },
  symbol: {
    nullable: true,
    type: 'Symbol',
  },
  timestamp: {
    default: () => Date.now(),
    nullable: true,
    type: 'number',
  },
  url: {
    max: 4096,
    min: 2,
    nullable: true,
    type: 'url',
    typebase: 'string',
    validator: (value: string) => validate(value, PATTERN.URI),
  }
}

export const Register = (name: string, typedef: TypeDefinition): void => {
  TypeDefinitions[name] = typedef
}

export const Resolve = (name: string): TypeDefinition => {
  return TypeDefinitions[name]
}
