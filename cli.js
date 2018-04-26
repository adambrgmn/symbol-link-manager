/* eslint-disable no-console */
import { dirname } from 'path';
import pkgUp from 'pkg-up';
import linkManager from './lib/link-manager';
import getConfig from './lib/get-config';

async function main() {
  try {
    const projectFolder = dirname(await pkgUp());
    const config = await getConfig({ projectFolder });

    await linkManager(config, { projectFolder });
    console.log('All done!');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

main();
