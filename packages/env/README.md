# @nofrills/env

[![npm](https://img.shields.io/npm/v/@nofrills/env.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/env)

# Install

```
yarn add @nofrills/env

npm install --save @nofrills/env
```

# Merge with Environment Variables

`env` can merge configuration values with their environment variable declarations. Provided with the following runtime configuration:

```typescript
export const ConfigurationInstance = {
  database: {
    host: 'localhost',
    name: 'database',
    username: ?,
    password: ?,
    port: 3306,
  },
  version: {
    major: 1,
    minor: 0,
  }
}
```

Seems we need to somehow fill the username and password. Since we don't want to store usernames and password when we commit our file, we can merge it with environment variables to determine the credentials to use. Environment variables are a great way to quickly configure an application without messing with files or interfering with other running instances. Let's go ahead and use the `env` object to merge our configuration and environment variables. It does this through the convention of object keys being names of the variables. First, let's see what those keys look like.

```typescript
const env = Env.merge([ConfigurationInstance])
const key = Env.key('database.host') // APP_DATABASE_HOST
```

Note that we always will emit environment variables as upper cased names, prepended with a prefix. However, the case of the environment variables do not matter as we will find them anyway.

Next, let's export our environment variables and use them with our configuration.

```bash
export APP_DATABASE_USERNAME="test"
export APP_DATABASE_PASSWORD="test-password"
```
```typescript
const env = Env.merge([ConfigurationInstance])
const username = env.value('database.username') // test
const password = env.value('database.password') // test-password
```

As you can see, it will try to grab the value from the environment if it exists. However, if it does not exist, a default value or an empty string is returned.

What if we specified the username and password, but wanted to override the values from the environment instead? We can do that as well, by specifying to use the environment variables first.

```typescript
const env = Env.merge([ConfigurationInstance], { override: EnvOverrideType.EnvironmentFirst })
```

Now, when we wrap the configuration instance, we will use overrides from the environment.

```bash
export APP_DATABASE_HOST=my.example.com
```
```typescript
const host = env.value('database.host') // my.example.com
```

# Import from Environment Variables

We can also import and create a configuration object from environment variables, so long as they are created with the convention. Note how we use the `toObject` method to materialize a configuration object.

Also note how we are able to control the casing of the object by the casing of the environment variable. However, this behavior may change in the future, as it presents a consistency issue when used across machines.

```bash
export APP_RUNTIME_DATABASE="mssql"
export APP_RUNTIME_HOST="localhost"
export APP_version="1.0"
```
```typescript
const env = Env.from()
const config = env.toObject()
console.log(config.RUNTIME.DATABASE) // mssql
console.log(config.RUNTIME.HOST) // localhost
console.log(config.version) // 1.0
```

# Options

```typescript
export interface EnvOptions {
  env: DictionaryOf<string | undefined>
  override?: EnvOverrideType
  prefix: string
  sync: boolean
}
```

## env

Specifies the object that contains the environment variables, usually from `process.env`. Can also be used when testing to use a known set of environment variables.

## override

An enum value indicating configuration value preference. The default value is `ConfigFirst`, which means values are read from the configuration object when avialable, falling back to the default value, and finally using the environment variable, if it has one.

`EnvironmentFirst` will always use the environment variable, regardless of whether the configuration object contains a value or not.

```typescript
export enum EnvOverrideType {
  ConfigFirst = 'config-first',
  EnvironmentFirst = 'environment-first',
}
```

## prefix

Specifies the prefix to use when looking for environment variables. The default is `app`.

## sync

Specifies whether or not to sync environment variables with the underlying configuration object. The default is `false`.

# Misc

For further use cases, please see the unit tests.

# FAQ

### Q: Why is sync not the default option?
Syncing doesn't truly mean anything except that it keeps track of the underling configuration object values as they are read from the environment (when a configuration value does not exist).

### Q: Why is `EnvironmentFirst` not the default option?
Currently, using `EnvironmentFirst` will skip checking the configuration object. Why would you want to do this? Because you might have an environment only configuration that you want to materialize as a JS object.

### Q: Why can't I add configuration variables at runtime?
Your configuration object should be immutable once you've materialized it (however that is done).

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
