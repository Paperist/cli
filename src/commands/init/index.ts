import * as path from 'path';
import { Arguments } from 'yargs';
import * as Listr from 'listr';
import * as simpleGit from 'simple-git/promise';
import Command from '../Command';
import Config from '../../utils/Config';

interface InitArguments extends Arguments {
  quiet: boolean;
}

class Init extends Command<InitArguments> {
  public command = 'init';
  public describe = '';

  public tasks = new Listr<InitArguments>([
    {
      title: 'Initialize',
      async task(ctx, task) {
        const [, relativePath = '.'] = ctx._;
        const dirPath = path.resolve(process.cwd(), relativePath);
        task.output = `Initializing at ${dirPath}`;

        const git = simpleGit(process.cwd());
        await git.clone('https://github.com/Paperist/starter-kit.git', dirPath);
        await new Config(dirPath).write({}, true);
      },
    },
  ]);
}

export default new Init();
