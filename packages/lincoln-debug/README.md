# @nofrills/lincoln-debug

[![npm](https://img.shields.io/npm/v/@nofrills/lincoln-debug.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/lincoln-debug)
[![Travis](https://img.shields.io/travis/nativecode-dev/nofrills-lincoln-debug.svg?style=flat-square&label=travis)](https://travis-ci.org/nativecode-dev/nofrills-lincoln-debug)
[![David](https://img.shields.io/david/nativecode-dev/nofrills-lincoln-debug.svg?style=flat-square&label=deps)](https://www.npmjs.com/package/@nofrills/lincoln-debug)
[![David](https://img.shields.io/david/dev/nativecode-dev/nofrills-lincoln-debug.svg?style=flat-square&label=devdeps)](https://www.npmjs.com/package/@nofrills/lincoln-debug)
[![Coverage Status](https://coveralls.io/repos/nativecode-dev/nofrills-lincoln-debug/badge.svg?branch=master)](https://coveralls.io/r/nativecode-dev/nofrills-lincoln-debug?branch=master)

# Install

```bash
npm install --save @nofrills/lincoln-debug
```

# Quick Start

### Javascript

```javascript
const logging = require('@nofrills/lincoln-debug')
const logger = logging.CreateLogger('myapp')
logger.debug('Hello, cruel Javascript world!')
```

### Typescript

```typescript
import { CreateLogger } from '@nofrills/lincoln-debug'
const logger = CreateLogger'myapp')
logger.debug('Hello, cruel Typescript world!')
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
