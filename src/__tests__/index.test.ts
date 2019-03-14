import terminalSpawn, { terminalSpawnParallel } from '../index';

describe('terminal-spawn tests', () => {
  describe('single command tests', () => {
    test('runs command and give exit code of zero', async () => {
      const subprocess = await terminalSpawn('echo "hello world!"');
      expect(subprocess.status).toBe(0);
    });

    test('runs command in other directory and give exit code of zero', async () => {
      const subprocess = await terminalSpawn('pwd', {
        cwd: '/home',
      });
      expect(subprocess.status).toBe(0);
    });

    test('runs command and gives non-zero exit code', async () => {
      // the shell doesn't have a "blarg" command
      const subprocess = await terminalSpawn('blarg "hello world!"');
      expect(subprocess.status).not.toBe(0);
    });
  });

  describe('serial tests', () => {
    test('runs commands serially and give exit code of zero', async () => {
      const subprocess = await terminalSpawn([
        'echo "hello "',
        'echo "world!"',
      ]);
      expect(subprocess.status).toBe(0);
    });
  });

  describe('parallel tests', () => {
    test('runs single command in parallel and give exit code of zero', async () => {
      const subprocess = await terminalSpawnParallel('echo "hello world!"');
      expect(subprocess.status).toBe(0);
    });

    test('runs commands in parallel and give exit code of zero', async () => {
      const subprocess = await terminalSpawnParallel([
        'echo "hello "',
        'echo "world!"',
      ]);
      expect(subprocess.status).toBe(0);
    });
  });
});
