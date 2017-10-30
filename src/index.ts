import * as yargs from 'yargs';

import init from './commands/init';
import build from './commands/build';
import watch from './commands/watch';
import clean from './commands/clean';
import template from './commands/template';

console.log = () => {};

yargs
  .command(init)
  .command(build)
  .command(watch)
  .command(clean)
  .command(template)
  .options({
    quiet: {
      alias: 'q',
      describe: 'Only print errors',
      default: false,
      type: 'boolean',
    },
  })
  .demandCommand(1)
  .strict().argv;
