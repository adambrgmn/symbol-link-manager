/* eslint-disable no-console */
import chalk from 'chalk';

const replace = (repl, wi = '') => str => str.replace(repl, wi);

const indicators = {
  LINKED: chalk.green('→'),
  ERROR: chalk.red('⨯'),
  NONE: chalk.gray('↩︎'),
};

function logResult(res, { projectFolder }) {
  const clean = replace(projectFolder, '.');

  res.forEach(({ link, target, result }) => {
    console.log(chalk.gray(`${clean(link)} → ${clean(target)}`));

    const padLength =
      clean([...result].sort((a, b) => b.link.length - a.link.length)[0].link)
        .length + 1;

    result.forEach(re => {
      console.log(
        `  ${clean(re.link).padEnd(padLength)} ${
          indicators[re.action]
        }  ${clean(re.target)}`,
      );
    });

    console.log('');
  });

  console.log(`
${indicators.LINKED} = Ok
${indicators.ERROR} = Error
${indicators.NONE} = Ignored
  `);
}

export { logResult as default };
