import * as path from 'path';
import { Arguments } from 'yargs';
import * as Listr from 'listr';
import * as glob from 'glob-promise';
import Command from '../Command';
import clean from '../clean';
import findBaseDir from '../../utils/findBaseDir';
import wait from '../../utils/wait';
import markdownToLaTeX from '../../utils/markdownToLaTeX';
import runLaTeX from '../../utils/runLaTeX';

interface BuildArguments extends Arguments {
  quiet: boolean;
}

class Build extends Command<BuildArguments> {
  public command = 'build';
  public describe = '';

  public tasks = new Listr<BuildArguments>([
    {
      title: 'Cleanup',
      async task(_ctx, _task) {
        return clean.tasks;
      },
      skip(ctx) {
        if (ctx._[0] === 'watch') {
          return 'Skipped when watching';
        }
        return '';
      },
    },
    {
      title: 'Convert Markdown to LaTeX',
      async task(_ctx, _task) {
        const baseDir = await findBaseDir();
        const exportDir = path.resolve(baseDir, './.paperist/dist');
        const files = await glob(path.resolve(baseDir, './src/*.md'));
        const tasks = files.map(file => ({
          title: path.basename(file),
          async task() {
            return Promise.all([markdownToLaTeX(file, baseDir, exportDir), wait(1000)]);
          },
        }));

        return new Listr(tasks, { concurrent: true });
      },
    },
    {
      title: 'Generate PDF via LaTeX',
      async task(_ctx, _task) {
        await runLaTeX(process.cwd());
      },
    },
  ]);
}

export default new Build();
