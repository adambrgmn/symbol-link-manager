import fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { tmpdir } from 'os';
import rimraf from 'rimraf';
import _mkdirp from 'mkdirp';
import linkManager from '../link-manager';

const tmpDir = fs.mkdtempSync(join(tmpdir(), 'link-manager-test'));

const access = promisify(fs.access);
const lstat = promisify(fs.lstat);
const writeFile = promisify(fs.writeFile);
const mkdirp = promisify(_mkdirp);
const rm = promisify(rimraf);

const getTempPath = name => join(tmpDir, name);

const createTestDirectory = async name => {
  const p = getTempPath(name);
  await mkdirp(p);

  return () => rm(p);
};

const createTestFile = async name => {
  const p = getTempPath(name);
  await writeFile(p, 'foo', 'utf8');

  return () => rm(p);
};

const hasAccess = async path => {
  try {
    await access(path, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const isSymLink = async path => {
  const stats = await lstat(path);
  return stats.isSymbolicLink();
};

describe('lib/link-manager', () => {
  beforeEach(async () => {
    await mkdirp(tmpDir);
  });

  afterEach(async () => {
    await rm(tmpDir);
  });

  test('should create symlinks for all paths in config', async () => {
    const config = {
      './old/{all}': join('./new', '{all}'),
    };

    await Promise.all([
      createTestDirectory('old/test1'),
      createTestDirectory('old/test2'),
    ]);

    await linkManager(config, { projectFolder: tmpDir });

    expect(await hasAccess(getTempPath('new/test1'))).toBeTruthy();
    expect(await isSymLink(getTempPath('new/test1'))).toBeTruthy();

    expect(await hasAccess(getTempPath('new/test2'))).toBeTruthy();
    expect(await isSymLink(getTempPath('new/test2'))).toBeTruthy();
  });

  test('should accept multiple paths', async () => {
    const config = {
      './old1/{all}': join('./new1', '{all}'),
      './old2/{all}': join('./new2', '{all}'),
    };

    await Promise.all([
      createTestDirectory('old1/test1'),
      createTestDirectory('old2/test1'),
    ]);

    await linkManager(config, { projectFolder: tmpDir });

    expect(await isSymLink(getTempPath('new1/test1'))).toBeTruthy();
    expect(await isSymLink(getTempPath('new2/test1'))).toBeTruthy();
  });

  test('should be able to ignore files', async () => {
    const config = {
      './old/{dir}': join('./new', '{dir}'),
    };

    await createTestDirectory('old');
    await Promise.all([
      createTestDirectory('old/test1'),
      createTestFile('old/foo.md'),
    ]);

    await linkManager(config, { projectFolder: tmpDir });

    expect(await hasAccess(getTempPath('new/test1'))).toBeTruthy();
    expect(await hasAccess(getTempPath('new/foo.md'))).toBeFalsy();
  });

  test('should be able to ignore folders', async () => {
    const config = {
      './old/{file}': join('./new', '{file}'),
    };

    await createTestDirectory('old');
    await Promise.all([
      createTestDirectory('old/test1'),
      createTestFile('old/foo.md'),
    ]);

    await linkManager(config, { projectFolder: tmpDir });

    expect(await hasAccess(getTempPath('new/test1'))).toBeFalsy();
    expect(await hasAccess(getTempPath('new/foo.md'))).toBeTruthy();
  });
});
