# @nofrills/tasks

[![npm](https://img.shields.io/npm/v/@nofrills/tasks.svg?style=flat-square)](https://www.npmjs.com/package/@nofrills/tasks)

# Introduction

`tasks` is a simple to use task executor that can work stand-alone using a `tasks.json` or in a `package.json` file. Tasks allows you to specify a set of commands that form a script.

# Install

```bash
npm install --save @nofrills/tasks
```

# Specifying Tasks

## Simple

A task can be as simple as a command to call an executable.

```json
{
  "tasks": {
    "echo": ["echo $0"]
  }
}
```

After saving to `tasks.json`, you can execute the command by running `cli-tasks echo`.

You can also specify multiple commands to run for any give task.

```json
{
  "tasks": {
    "build": [
      "rm -rf lib",
      "tslint --project tsconfig.json --config tslint.json",
      "tsc --project tsconfig.json"
    ]
  }
}
```

When you run the task, it will execute the commands in order. Hopefully, you can quickly see how by using just this construct, it allows you go string together any common operating system task.

## Injection

We can take it a step further by supporting injecting other tasks together.

```json
{
  "tasks": {
    "build": [
      "[clean]",
      "[lint]",
      "[build:tsc]"
    ],
    "build:tsc": [
      "tsc --project tsconfig.json"
    ],
    "clean": [
      "rimraf lib"
    ],
    "lint": [
      "tslint --project tsconfig.json --config tslint.json"
    ]
  }
}
```

By using the `[]` syntax, we can inject another task's entries into the current location. When we run `cli-tasks build`, we expect it to run the tasks in order.

```sh
rimraf lib
tslint --project tsconfig.json --config tslint.json
tsc --project tsconfig.json
```

# Advanced Tasks

So far, we've been using the short-hand for defining tasks. However, the underlying library supports a more descriptive structure.

```typescript
export interface Task {
  entries: TaskEntry[]
  shell?: boolean | string
}
```

The `Task` type defines a list of entries in addition to allowing you to specify the shell to use when executing the task.

```typescript
export interface TaskEntry {
  arguments?: string[]
  command: string
  name?: string
}
```

A `TaskEntry` specifies the command to run.

```json
{
  "tasks": {
    "build": {
      "entries": [{
        "arguments": ["$0"],
        "command": "echo",
        "name": "current-shell"
      }],
      "shell": "/bin/bash"
    }
  }
}
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
