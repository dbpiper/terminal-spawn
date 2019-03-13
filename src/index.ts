import { spawn, SpawnOptions } from 'child_process';

type Command = string | string[];

const spawnWithStringParser = (shellCommand: string) => {
  const shellCommandArray = shellCommand.split(' ');
  return {
    command: shellCommandArray[0],
    args: shellCommandArray.slice(1),
  };
};

const terminalSpawn = (
  command: Command,
  options: SpawnOptions = {
    stdio: 'inherit',
    shell: true,
  },
) => {
  let terminalCommand = '';
  if (Array.isArray(command)) {
    terminalCommand = command.join(' && ');
  } else {
    terminalCommand = command as string;
  }
  const commandObj = spawnWithStringParser(terminalCommand);
  return spawn(commandObj.command, commandObj.args, options);
};

const terminalSpawnParallel = (
  command: Command,
  options: SpawnOptions = {
    stdio: 'inherit',
    shell: true,
  },
) => {
  let terminalCommand = '';
  if (Array.isArray(command)) {
    terminalCommand = command.join(' & ');
    terminalCommand += '; wait';
  } else {
    terminalCommand = command as string;
  }
  const commandObj = spawnWithStringParser(terminalCommand);
  return spawn(commandObj.command, commandObj.args, options);
};

export default terminalSpawn;

export { terminalSpawnParallel };
