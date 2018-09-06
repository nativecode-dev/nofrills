# @nofrills/patterns

[![npm](https://img.shields.io/npm/v/@nofrills/patterns.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/patterns)

# Install

```bash
npm install --save @nofrills/patterns

yarn add @nofrills/patterns
```

# Patterns
Library to implement some common abstract patterns that occasionally useful in your day to day tasks. There are some design patterns as well as just general abstract patterns not associated with the 23 well-known design patterns.

## [DESIGN] Chain of Responsiblity
`Chain<T>` and `ChainAsync<T>` are implementations of the chain of responsibility pattern. You can add as many handlers as you want before calling `execute`, which can either execute inside-out or outside-in order.

```typescript
const handlers = [
  (input: string, next) => next()
]
const chains = Chains.from<string, string>(handlers)
chains.execute({})
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
