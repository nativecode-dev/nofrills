# @nofrills/env

[![npm](https://img.shields.io/npm/v/@nofrills/env.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/env)

# Instructions

```typescript
// APP_DATABASE=mssql
import { Env } from '@nofrills/env'

const defaultConfigFile = {
  database: 'sqlite',
  runtime: 'default.file',
}

const configFromFile = {
  database: 'mysql',
  runtime: 'overrides.file',
}

const env = Env.merge([defaultConfigFile, configFromFile])

env.key('database') // APP_DATABASE
env.key('runtime') // APP_RUNTIME

env.value('database') // 'mssql'
env.value('runtime') // 'overrides.file'
```

# Install

```bash
npm install --save @nofrills/env
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
