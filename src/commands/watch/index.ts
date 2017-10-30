import { Arguments } from 'yargs';
import * as sane from 'sane';
import * as chalk from 'chalk';
import * as moment from 'moment';
import { autobind } from 'core-decorators';
import debounce = require('lodash.debounce');
import Command from '../Command';
import build from '../build';
import findBaseDir from '../../utils/findBaseDir';

interface WatchArguments extends Arguments {
  quiet: boolean;
}

class Watch extends Command<WatchArguments> {
  public command = 'watch';
  public describe = 'Watch project';
  private running = false;
  private waiting = false;

  @autobind()
  async handler(argv: WatchArguments) {
    try {
      const baseDir = await findBaseDir();
      const watcher = sane(baseDir, {
        glob: ['latexmkrc', 'paperist.config.yml', 'src/**/*', 'assets/**/*', 'bibs/**/*', 'fonts/**/*'],
      });
      const buildFunc = debounce(this.build, 1000);

      watcher.on('ready', () => {
        console.info(`${chalk.default.cyan('INFO')} Watching on ${baseDir}`);
      });
      watcher.on('change', () => buildFunc(argv));
      watcher.on('add', () => buildFunc(argv));
      watcher.on('delete', () => buildFunc(argv));
    } catch (err) {
      console.error(chalk.default.red(err.message));
    }
  }

  @autobind()
  async build(argv: WatchArguments) {
    if (this.running) {
      this.waiting = true;
      return;
    }
    this.waiting = true;

    while (this.waiting) {
      this.waiting = false;
      this.running = true;
      await build.handler(argv).catch(() => {
        console.error(`${chalk.default.red('FAILED')} ${moment().format('YYYY/MM/DD HH:mm:ss Z')}`);
      });
      this.running = false;
    }
  }
}
export default new Watch();
