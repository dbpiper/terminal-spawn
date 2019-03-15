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
commands very easily. Since it returns _both_ a [`Promise`][promise] and a
[`ChildProcess`][child_process] it can [easily be used with gulp.][gulp-async-completion]

The [promise][promise] resolves with the same information as [`spawnSync`][spawn-sync-returns]
and does so once the [`close` event has been received][event-close] and thus you
can await the promise to resolve if you wish to ensure it completed.

This project uses [TypeScript][typescript] and thus has types for it exported,
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
  const subprocess = await terminalSpawn('echo "hello world!"').promise;

  if (subprocess.status === 0) {
    console.log('everything went well!');
  } else {
    console.warn('something went wrong!!!!');
  }
})();
```

### To spawn a task which never terminates, killing it and ensuring it was killed

```typescript
import terminalSpawn from 'terminal-spawn';

// execute inside of IIAFE since we can't use top-level await
(async () => {
  const subprocessSpawn = terminalSpawn(`
    while true
    do
      echo "hello world!"
      sleep 0.25
    done
  `);
  // wait for 500 ms to pass...
  const timeToWait = 500;
  await new Promise((resolve, _reject) =>
    setTimeout(() => {
      resolve();
    }, timeToWait),
  );
  subprocessSpawn.process.kill();
  // subprocess.signal should be 'SIGTERM'
  const subprocess = await subprocessSpawn.promise;
})();
```

## API

### terminalSpawn(command, options)

return type:

```ts
  {
    promise: Promise<SpawnSyncReturns<Buffer>>
    process: ChildProcess
  }
```

Executes the command inside of Node.js as if it were run in the shell. If
command is an array then the commands will be run in series/sequentially.

The result is an object which contains _both_ a [`Promise`][promise] which has
the same structure/type as the [return value of the synchronous version of `child_process.spawn`][spawn-sync-returns].
and also a ['ChildProcess`][child_process]. Each of these are useful in certain
circumstances, for example you need the process reference if you want to kill
an infinite process. You may want to use the promise to check status codes
or termination signals to verify that the process actually ended and how.

### terminalSpawnParallel(command, options)

return type:

```ts
  {
    promise: Promise<SpawnSyncReturns<Buffer>>
    process: ChildProcess
  }
```

Executes the command inside of Node.js as if it were run in the shell, if
command is an array then the commands will be run in parallel rather than
in series/sequentially.

The result is an object which contains _both_ a [`Promise`][promise] which has
the same structure/type as the [return value of the synchronous version of `child_process.spawn`][spawn-sync-returns].
and also a ['ChildProcess`][child_process]. Each of these are useful in certain
circumstances, for example you need the process reference if you want to kill
an infinite process. You may want to use the promise to check status codes
or termination signals to verify that the process actually ended and how.

### command

type: `string` or `string[]`

The command will be run using the shell and the output will be redirected to the
shell. This means that it will essentially function as if you ran it directly in
a shell such as `/bin/sh`, but inside of Node.js.

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

The API for options is designed to be as user-friendly as possible thus,
it assumes that you want to keep the terminal-like behavior, but may want
to change other options such as using `cwd`. To support this the user-provided
options are added to the default options, rather than always overwriting them
(aka. set union). However, if you explicitly specify a a default command such
as `stdio` then it _will_ be overwritten.

However, it should be noted that if you pass the option `shell: false` then
many features such as multiple commands run in series or parallel will not work
due to reliance on running in a shell.

### License

[MIT](https://github.com/dbpiper/terminal-spawn/blob/master/LICENSE) Copyright (c) [David Piper](https://github.com/dbpiper)

[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[spawn-sync-returns]: https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
[child_process]: https://nodejs.org/api/child_process.html#child_process_class_childprocess
[child_process.spawn]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
[typescript]: https://www.typescriptlang.org/
[gulp-async-completion]: https://gulpjs.com/docs/en/getting-started/async-completion
[event-close]: https://nodejs.org/api/child_process.html#child_process_event_close
