import terminalSpawn from '../index';

describe('terminal-spawn tests', () => {
  test('runs command and give exit code of zero', async () => {
    const process = terminalSpawn('echo "hello world!"');
    const processPromise = new Promise((resolve, _reject) => {
      process.on('exit', code => {
        const numCode = (code as unknown) as PromiseLike<number>;
        resolve(numCode);
      });
    });
    const exitCode = await processPromise;
    expect(exitCode).toBe(0);
  });

  test('runs command and gives non-zero exit code', async () => {
    // the shell doesn't have a "blarg" command
    const process = terminalSpawn('blarg "hello world!"');
    const processPromise = new Promise((resolve, _reject) => {
      process.on('exit', code => {
        const numCode = (code as unknown) as PromiseLike<number>;
        resolve(numCode);
      });
    });
    const exitCode = await processPromise;
    expect(exitCode).not.toBe(0);
  });
});
