# terminal-spawn

[![Build Status](https://travis-ci.com/dbpiper/terminal-spawn.svg?branch=master)](https://travis-ci.com/dbpiper/terminal-spawn)
[![npm version](http://img.shields.io/npm/v/terminal-spawn.svg?style=flat)](https://npmjs.org/package/terminal-spawn 'View this project on npm')
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

A library which wraps Node's [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
to provide easy use of terminal commands.

It does this in an easy to use way by providing a nice interface on top of
[`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
which allows you to call it exactly the same way as
if you were running commands directly in the terminal.

I personally use this for running [gulp](https://github.com/gulpjs/gulp) tasks,
since I got used to using npm scripts and their ability to directly run terminal
commands very easily. Since it returns a `Promise<SpawnSyncReturns<Buffer>>`,
[it can be directly used in gulp](https://gulpjs.com/docs/en/getting-started/async-completion#returning-a-promise),
see the [`gulpfile.babel.ts`](https://github.com/dbpiper/terminal-spawn/blob/master/gulpfile.babel.ts)
in this project for an example.

The project uses [TypeScript][typescript] and thus has types for it exported,
so it works well in that environment. However, it also works just fine with
vanilla JavaScript.

## Installation

```sh
  npm install terminal-spawn
```

## Usage

### To just spawn a task if you don't need to know when it finishes

```typescript
import terminalSpawn from 'terminal-spawn';

terminalSpawn('echo "hello world!"');
```

### To spawn a task and wait for it to complete, checking status code

```typescript
import terminalSpawn from 'terminal-spawn';

// execute inside of IIAFE since we can't use top-level await
(async () => {
  const subprocess = await terminalSpawn('echo "hello world!"');

  if (subprocess.status === 0) {
    console.log('everything went well!');
  } else {
    console.warn('something went wrong!!!!');
  }
})();
```

## API

### terminalSpawn(command, options)

return type: `Promise<SpawnSyncReturns<Buffer>>`

Executes the command inside of Node.js as if it were run in the shell. If
command is an array then the commands will be run in series/sequentially.

The result is a [`Promise`][promise] which has the same structure/type as the
[return value of the synchronous version of `child_process.spawn`](spawn-sync-returns).

### terminalSpawnParallel(command, options)

return type: `Promise<SpawnSyncReturns<Buffer>>`

Executes the command inside of Node.js as if it were run in the shell, if
command is an array then the commands will be run in parallel rather than
in series/sequentially.

The result is a [`Promise`][promise] which has the same structure/type as the
[return value of the synchronous version of `child_process.spawn`](spawn-sync-returns).

### command

type: `string` or `string[]`

The command will be run using the shell and the output will be redirected to the shell.
This means that it will essentially function as if you ran it directly in a
shell such as `/bin/sh`, but inside of Node.js.

If command is an array then all of the commands in the array will be executed:
either in series or in parallel, depending on the function. The default is to
executed them in series, as if they were called with `&&` between them.

### options

type: `SpawnOptions`

These are the options to pass to [`child_process.spawn`][child_process.spawn]
they are the same as the [`spawn` options][child_process.spawn]
and are passed directly to [`child_process.spawn`][child_process.spawn].

By default they are:

```ts
  {
    stdio: 'inherit',
    shell: true,
  }
```

Which allows `terminalSpawn` to act like a terminal. However, if you wanted the
nice argument passing of terminalSpawn, e.g. `'echo "hello world!"` without
**actually** using the terminal, then you could disable this using `options`.

### License

[MIT](https://github.com/dbpiper/terminal-spawn/blob/master/LICENSE) Copyright (c) [David Piper](https://github.com/dbpiper)

[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[spawn-sync-returns]: https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
[child_process.spawn]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
[typescript]: https://www.typescriptlang.org/
