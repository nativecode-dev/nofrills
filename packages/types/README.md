# @nofrills/types

[![npm](https://img.shields.io/npm/v/@nofrills/types.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/types)

# Install

```bash
npm install --save @nofrills/types
```

# Introduction

`@nofrills/types` is a library that provides a consistent runtime type checking for JavaScript instances. In addition to basic types, such as `string`, `boolean`, etc, `types` also supports more complex type definitions, such as custom types. You can register your own types and ensure that your runtime instances truly match definitions you specify.

## Is

Use the `Is` helper to validate basic types, such as `string`, `boolean`, `Date`, etc.

```javascript
const isDate = Is.date(Date.now()) // false
const isNumber = Is.number(Date.now()) // true
const isString = Is.string('this is a string') // true
```

```typescript
const isDate: boolean = Is.date(Date.now()) // false
const isNumber: number = Is.number(Date.now()) // true
const isString: boolean = Is.string('this is a string') // true
```

## Types

Use the `Types` registry to retrieve or add type definitions for the runtime to validate.

```javascript

```

```typescript
```

# FAQ

## Q: What is the difference between `Is` and `Types`?

### A: The `Is` helper is meant to be a basic type checker for primitives while `Types` is meant to be used as a custom type validator.

# License
Copyright 2018 NativeCode Development <opensource@nativecode.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
