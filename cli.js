/* eslint-disable no-console */
import { dirname } from 'path';
import pkgUp from 'pkg-up';
import chalk from 'chalk';
import linkManager from './lib/link-manager';
import getConfig from './lib/get-config';
import logResult from './lib/log-result';

async function main() {
  try {
    const projectFolder = dirname(await pkgUp());
    const config = await getConfig({ projectFolder });

    const result = await linkManager(config, { projectFolder });
    logResult(result, { projectFolder });
  } catch (err) {
    console.error(chalk.red(err));
    process.exit(1);
  }
}

main();
