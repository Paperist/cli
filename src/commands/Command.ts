import { Arguments, Argv } from 'yargs';
import * as Listr from 'listr';
import * as moment from 'moment';
import * as chalk from 'chalk';
import { autobind } from 'core-decorators';

export default class Command<T extends Arguments> {
  command: string[] | string;
  aliases?: string[] | string;
  describe?: string | false;
  tasks: Listr<T> = new Listr<T>([]);

  @autobind()
  builder(yargs: Argv) {
    return yargs;
  }

  @autobind()
  async handler(argv: T) {
    await this.tasks
      .run(argv)
      .then(() => console.info(`${chalk.default.green('Done')} ${moment().format('YYYY/MM/DD HH:mm:ss Z')}`))
      .catch(err => console.error(chalk.default.red(err.message)));
  }
}
