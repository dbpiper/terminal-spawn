# terminal-spawn

[![Build Status](https://travis-ci.com/dbpiper/terminal-spawn.svg?branch=master)](https://travis-ci.com/dbpiper/terminal-spawn)
[![npm version](http://img.shields.io/npm/v/terminal-spawn.svg?style=flat)](https://npmjs.org/package/terminal-spawn 'View this project on npm')
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A library which wraps Node's [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) to provide easy use of terminal commands.

It does this in an easy to use way by providing a nice interface on top of
[`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) which allows you to call it exactly the same way as if
you were running commands directly in the terminal.

I personally use this for running [gulp](https://github.com/gulpjs/gulp) tasks, since I got used to using npm scripts and their ability to directly run terminal commands very easily. Since it returns a [`ChildProcess`](https://nodejs.org/api/child_process.html#child_process_child_process) object, the result of calling [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) [it can be directly used in gulp](https://gulpjs.com/docs/en/getting-started/async-completion#returning-a-child-process), see the [`gulpfile.babel.ts`](https://github.com/dbpiper/terminal-spawn/blob/master/gulpfile.babel.ts) in the project for an example.

## Installation

```sh
  npm install terminal-spawn
```

## Usage

```typescript
import terminalSpawn from 'terminal-spawn';

terminalSpawn('echo "hello world!"');
```

## API

### terminalSpawn(command, options)

return type: [`ChildProcess`](https://nodejs.org/api/child_process.html#child_process_child_process)

Executes the command inside of Node.js as if it were run in the shell. Since it is just a lightweight wrapper around

### command

type: `string`

The command will be run using the shell and the output will be redirected to the shell. This means that it will essentially function as if you ran it directly in a shell such as `/bin/sh`, but inside of Node.js.

### options

type: `SpawnOptions`

These are the options to pass to [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) they are the same as the [`spawn` options](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) and are passed directly to [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

By default they are:

```ts
  {
    stdio: 'inherit',
    shell: true,
  }
```

Which allows `terminalSpawn` to act like a terminal. However, if you wanted the nice argument passing of terminalSpawn, e.g. `'echo "hello world!"` without **actually** using the terminal, then you could disable this using `options`.

### License

[MIT](https://github.com/dbpiper/terminal-spawn/blob/master/LICENSE) Copyright (c) [David Piper](https://github.com/dbpiper)
