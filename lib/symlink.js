import fs from 'fs';
import { promisify } from 'util';
import { exists, isSymbolicLink, linkPath } from './utils';

const sym = promisify(fs.symlink);

const actions = {
  error: 'ERROR',
  none: 'NONE',
  linked: 'LINKED',
};

async function symlink({ target, link }) {
  try {
    const fileExists = await exists(link);

    if (!fileExists) {
      await sym(target, link);
      return {
        target,
        link,
        action: actions.linked,
        message: `Linked ${link} to ${target}`,
      };
    }

    const isSymlink = await isSymbolicLink(link);

    if (isSymlink) {
      const existingTarget = await linkPath(link);
      const equal = existingTarget === target;

      return {
        target,
        link,
        action: actions.none,
        message: equal
          ? `${link} exists and already points to ${target}`
          : `${link} exists but points to ${existingTarget}, remove it to create a new link`,
      };
    }

    return {
      target,
      link,
      action: actions.none,
      message: `${link} exists but is not a symbolic link, remove it to create a new link`,
    };
  } catch (error) {
    return { target, link, action: actions.error, message: error.message };
  }
}

export { symlink as default, actions };
