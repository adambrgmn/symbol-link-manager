import fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

const CONFIG_NAME = '.symlinkrc';

const access = promisify(fs.access);
const readFile = promisify(fs.readFile);

const fileExists = async path => {
  try {
    await access(path);
    return true;
  } catch (err) {
    return false;
  }
};

async function getConfig({ projectFolder }) {
  const configPath = join(projectFolder, CONFIG_NAME);

  if (!(await fileExists(configPath))) {
    throw new Error(
      `Could not find a ${CONFIG_NAME} inside your project folder (${projectFolder})`,
    );
  }

  const config = JSON.parse(await readFile(configPath, 'utf8'));
  return config;
}

export { getConfig as default };
