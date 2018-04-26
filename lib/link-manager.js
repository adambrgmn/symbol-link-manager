import fs from 'fs';
import { promisify } from 'util';
import { resolve, dirname, basename } from 'path';
import _mkdirp from 'mkdirp';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const symlink = promisify(fs.symlink);
const mkdirp = promisify(_mkdirp);

/**
 * Gets the content of a directory returning an array of string absolute paths
 * to all entries inside the directory
 *
 * @param {String} dir
 * @returns Array<String>
 */
async function getContent(dir) {
  try {
    const content = await readdir(dir);
    return content.map(entry => resolve(dir, entry));
  } catch (err) {
    throw new Error(
      `Could not get contents of '${dir}'. Maybe it does not exist?`,
    );
  }
}

function filterEntries(type) {
  return async entries => {
    const filtered = await Promise.all(
      entries.map(async entry => {
        const stats = await stat(entry);
        switch (type) {
          case 'dir':
            return stats.isDirectory() ? entry : null;
          case 'file':
            return stats.isFile() ? entry : null;
          case 'all':
          default:
            return entry;
        }
      }),
    );

    return filtered.filter(Boolean);
  };
}

function mapToLinks(entries, { targetPath, linkPath }) {
  return entries.map(entry => ({
    target: entry,
    link: entry.replace(targetPath, linkPath),
  }));
}

async function symlinkEntry(entry) {
  try {
    await symlink(entry.target, entry.link);
  } catch (err) {
    throw new Error(`Could not symlink ${entry.target} to ${entry.link}`);
  }
}

/**
 * Takes an object with targets as keys and links as values and creates symlinks
 * The config object contains strings as both keys and values
 * e.g { './target/{dirs}': './new/path/{dirs}' }
 *
 * All paths should be absolute, or relative to project root (where your
 * package.json resides).
 *
 * @param {Object} config Configuration, targets and paths
 * @param {any} [projectFolder=process.cwd()]
 */
async function linkManager(config, { projectFolder = process.cwd() } = {}) {
  const entries = Object.entries(config);

  await Promise.all(
    entries.map(async ([target, link]) => {
      // Get the real path to folders, relative to project root
      const realTarget = resolve(projectFolder, target);
      const realLink = resolve(projectFolder, link);

      const targetPath = dirname(realTarget);
      const linkPath = dirname(realLink);

      // Get type to filter against ({dir}, {file} or {all})
      const type = basename(realTarget).replace(/(\{|\})/g, '');

      // Assure that the target path exists, if not create it
      await mkdirp(linkPath);

      // Get content of rootFolder
      const rootPathContent = await getContent(targetPath).then(
        filterEntries(type),
      );

      // Get root and new target path of all content, filter only directories
      const links = mapToLinks(rootPathContent, { targetPath, linkPath });

      // Symlink all root directories to new directories
      await Promise.all(links.map(symlinkEntry));
    }),
  );
}

export { linkManager as default };
