# @nofrills/lincoln-debug

[![npm](https://img.shields.io/npm/v/@nofrills/lincoln-debug.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/lincoln-debug)

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
