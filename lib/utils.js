import fs from 'fs';
import { promisify } from 'util';

const access = promisify(fs.access);
const lstat = promisify(fs.lstat);
const realpath = promisify(fs.realpath);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (err) {
    return false;
  }
}

async function isSymbolicLink(path) {
  const stats = await lstat(path);
  return stats.isSymbolicLink();
}

function linkPath(symlinkPath) {
  return realpath(symlinkPath);
}

function flatten(arr) {
  return arr.reduce((acc, a) => {
    if (Array.isArray(a)) return [...acc, ...flatten(a)];
    return [...acc, a];
  }, []);
}

export { exists, isSymbolicLink, linkPath, flatten };
