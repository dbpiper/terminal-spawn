import {
  ChildProcess,
  spawn,
  SpawnOptions,
  SpawnSyncReturns,
} from 'child_process';
import { Command, SpawnPromiseReturns } from './index';

type TerminalSpawnProcess = (
  command: Command,
  options?: SpawnOptions,
) => ChildProcess;

/* *****************************************************************************
 * Private Variables
 **************************************************************************** */

const _spawnOptions: SpawnOptions = {
  stdio: 'inherit',
  shell: true,
};

const _spawnWithStringParser = (shellCommand: string) => {
  const shellCommandArray = shellCommand.split(' ');
  return {
    command: shellCommandArray[0],
    args: shellCommandArray.slice(1),
  };
};

/* *****************************************************************************
 * Public Variables
 **************************************************************************** */

const terminalSpawnPromiseWrapper = (
  subprocess: ChildProcess,
): SpawnPromiseReturns =>
  new Promise<SpawnSyncReturns<Buffer>>((resolve, _reject) => {
    let stdin = '';
    let stdout = '';
    let stderr = '';
    let error = {
      name: '',
      message: '',
    };

    if (subprocess.stdin) {
      subprocess.stdin.on('data', (chunk: Buffer) => {
        stdin += chunk.toString();
      });
    }

    if (subprocess.stdout) {
      subprocess.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
    }

    if (subprocess.stderr) {
      subprocess.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });
    }

    subprocess.on('error', (err: Error) => {
      error = err;
    });

    subprocess.on('close', (code: number, signal: string) => {
      resolve({
        error,
        signal,
        pid: process.pid,
        output: [stdin, stdout, stderr],
        stdout: Buffer.from(stdout),
        stderr: Buffer.from(stderr),
        status: code,
      });
    });
  });

const terminalSpawnProcess: TerminalSpawnProcess = (
  command: Command,
  options?: SpawnOptions,
) => {
  let terminalCommand = '';
  if (Array.isArray(command)) {
    terminalCommand = command.join(' && ');
  } else {
    terminalCommand = command as string;
  }
  const commandObj = _spawnWithStringParser(terminalCommand);
  const spawnOptions: SpawnOptions = { ..._spawnOptions, ...options };
  return spawn(commandObj.command, commandObj.args, spawnOptions);
};

const terminalSpawnParallelProcess: TerminalSpawnProcess = (
  command: Command,
  options?: SpawnOptions,
) => {
  let terminalCommand = '';
  if (Array.isArray(command)) {
    terminalCommand = command.join(' & ');
    terminalCommand += '; wait';
  } else {
    terminalCommand = command as string;
  }
  const commandObj = _spawnWithStringParser(terminalCommand);
  const spawnOptions: SpawnOptions = { ..._spawnOptions, ...options };
  return spawn(commandObj.command, commandObj.args, spawnOptions);
};

export {
  terminalSpawnPromiseWrapper,
  terminalSpawnParallelProcess,
  terminalSpawnProcess,
};
