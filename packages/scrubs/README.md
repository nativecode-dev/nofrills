# @nofrills/scrubs

[![npm](https://img.shields.io/npm/v/@nofrills/scrubs.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/scrubs)
[![Travis](https://img.shields.io/travis/nativecode-dev/nofrills-scrubs.svg?style=flat-square&label=travis)](https://travis-ci.org/nativecode-dev/nofrills-scrubs)
[![David](https://img.shields.io/david/nativecode-dev/nofrills-scrubs.svg?style=flat-square&label=deps)](https://www.npmjs.com/package/@nofrills/scrubs)
[![David](https://img.shields.io/david/dev/nativecode-dev/nofrills-scrubs.svg?style=flat-square&label=devdeps)](https://www.npmjs.com/package/@nofrills/scrubs)
[![Coverage Status](https://coveralls.io/repos/github/nativecode-dev/nofrills-scrubs/badge.svg?branch=master)](https://coveralls.io/github/nativecode-dev/nofrills-scrubs?branch=master)

No frills data scrubbing to help remove sensitive data from object properties and strings.

# Install

```bash
npm install --save @nofrills/scrubs
```

# Quick Start

### Javascript

```javascript
const scrubs = require('@nofrills/scrubs')
const data = {
  password: 'password123'
}
const scrubbed = scrubs.scrub(data)
// -> should return { password: "<secured>" }
```

### Typescript

```typescript
import { scrub } from '@nofrills/scrubs'
const data = {
  password: 'password123'
}
const scrubbed = scrub(data)
// -> should return { password: "<secured>" }
```

NOTE: From here on, we'll use Javascript in examples.

# Options
You can also use an options object to inject some customizations and extensions.

```javascript
{
  properties: ['apikey', 'api_key', 'password'],
  text: '<secured>'
}
```

Once you've created your options, you can pass it to the `Scrubs` class.

```javascript
const Scrubs = require('@nofrills/scrubs').Scrubs
const scrubber = new Scrubs({
  secured: {
    properties: ['apikey', 'api_key', 'password'],
    text: '<password>'
  }
scrubber.scrub({ password: "password123" })
// -> will replace password with "<password>"
})
```

### Properties
Properties are an array of strings representing the properties on an object that require securing. By default, `apikey`, `api_key`, and `password` are secured.

# Extensibility
You can extend how `scrubs` works by registering custom handlers to scrub a provided value.

In Typescript parlance, we define a callback via the `Scrubber<T>` type.

```typescript
type Scrubber<T> = (value: T, options: ScrubsOptions, instance: Scrubs) => T
```

Simply create your handler and register it before scrubbing, like so:

## Javascript

```javascript
const R = require('@nofrills/scrubs').Registry

const Handler = (value, options, scrubs) => {
  // TODO: Something super fantastic that scrubs
  // the value of sensitive data.
  return value
}

R.register('string', Handler)
```

# License

Copyright 2017 NativeCode Development <support@nativecode.com>

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
