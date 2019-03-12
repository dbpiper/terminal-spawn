import { parallel, series } from 'gulp';
import spawnTerminal from './src';

const checkTypes = () => spawnTerminal('npx tsc -p "./tsconfig.json"');

const lintTS = () => {
  const rootFiles = '"./*.ts?(x)"';
  const srcFiles = '"./src/**/*.ts?(x)"';
  const configFiles = '"./config/**/*.ts?(x)"';
  const tsconfig = '--project tsconfig.json';
  return spawnTerminal(
    `npx tslint ${rootFiles} ${srcFiles} ${configFiles} ${tsconfig}`,
  );
};

const lint = lintTS;

const test = () => spawnTerminal('npx jest');

const staticCheck = series(lint, checkTypes);

const staticCheckAndTest = series(staticCheck, test);

const buildJs = () =>
  spawnTerminal(`npx babel src --out-dir lib --extensions ".ts"`);

const buildTypes = () => spawnTerminal('npx tsc');

const build = parallel(buildJs, buildTypes);

const gitStatus = () => spawnTerminal('npx git status');

const sleep = (seconds: number = 0) => spawnTerminal(`sleep ${seconds}`);

const sleepForReview = () => {
  // giving 4 seconds to review the git commit status
  const reviewTime = 4;
  return sleep(reviewTime);
};

const gitStatusHumanReview = series(gitStatus, sleepForReview);

const preCommit = series(gitStatusHumanReview, build, staticCheckAndTest);

export {
  checkTypes,
  lintTS,
  lint,
  test,
  staticCheck,
  staticCheckAndTest,
  buildJs,
  buildTypes,
  build,
  preCommit,
};

export default build;
