import terminalSpawn, { terminalSpawnParallel } from '../index';

describe('terminal-spawn tests', () => {
  describe('single command tests', () => {
    test('runs command and give exit code of zero', async () => {
      const subprocess = await terminalSpawn('echo "hello world!"').promise;
      expect(subprocess.status).toBe(0);
    });

    test('runs command that never ends, is killed and give exit code of zero', async () => {
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
        }, timeToWait)
      );
      subprocessSpawn.process.kill();
      const subprocess = await subprocessSpawn.promise;
      expect(subprocess.signal).toEqual('SIGTERM');
    });

    test('runs command in other directory and give exit code of zero', async () => {
      const subprocess = await terminalSpawn('pwd', {
        cwd: '/home',
      }).promise;
      expect(subprocess.status).toBe(0);
    });

    test('runs command and gives non-zero exit code', async () => {
      // the shell doesn't have a "blarg" command
      const subprocess = await terminalSpawn('blarg "hello world!"').promise;
      expect(subprocess.status).not.toBe(0);
    });
  });

  describe('serial tests', () => {
    test('runs commands serially and give exit code of zero', async () => {
      const subprocess = await terminalSpawn(['echo "hello "', 'echo "world!"'])
        .promise;
      expect(subprocess.status).toBe(0);
    });
  });

  describe('parallel tests', () => {
    test('runs single command in parallel and give exit code of zero', async () => {
      const subprocess = await terminalSpawnParallel('echo "hello world!"')
        .promise;
      expect(subprocess.status).toBe(0);
    });

    test('runs commands in parallel and give exit code of zero', async () => {
      const subprocess = await terminalSpawnParallel([
        'echo "hello "',
        'echo "world!"',
      ]).promise;
      expect(subprocess.status).toBe(0);
    });
  });
});
