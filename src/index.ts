import { ChildProcess, SpawnOptions, SpawnSyncReturns } from 'child_process';
import {
  terminalSpawnParallelProcess,
  terminalSpawnProcess,
  terminalSpawnPromiseWrapper,
} from './util';

export type SpawnPromiseReturns = Promise<SpawnSyncReturns<Buffer>>;
export type Command = string | string[];

export interface TerminalSpawnReturns {
  process: ChildProcess;
  promise: SpawnPromiseReturns;
}

const terminalSpawn = (
  command: Command,
  options?: SpawnOptions,
): TerminalSpawnReturns => {
  const subprocess = terminalSpawnProcess(command, options);
  const promise = terminalSpawnPromiseWrapper(subprocess);
  return {
    promise,
    process: subprocess,
  };
};

const terminalSpawnParallel = (
  command: Command,
  options?: SpawnOptions,
): TerminalSpawnReturns => {
  const subprocess = terminalSpawnParallelProcess(command, options);
  const promise = terminalSpawnPromiseWrapper(subprocess);
  return {
    promise,
    process: subprocess,
  };
};

export default terminalSpawn;

export { terminalSpawnParallel };
