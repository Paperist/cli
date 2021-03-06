import { Argv, Arguments } from 'yargs';
import * as Listr from 'listr';
import { autobind } from 'core-decorators';
import Command from '../../Command';
import findBaseDir from '../../../utils/findBaseDir';
import TemplatePackage from '../../../utils/TemplatePackage';

interface InstallArguments extends Arguments {
  quiet: boolean;
  withExample: boolean;
}

class Install extends Command<InstallArguments> {
  public command = 'install';
  public describe = 'Install template';
  public aliases = ['add'];

  public tasks = new Listr<InstallArguments>([
    {
      title: 'Install',
      async task(ctx, _task) {
        const packageNameList = ctx._.splice(2);
        if (packageNameList.length === 0) {
          return;
        }
        const baseDir = await findBaseDir();
        return new Listr<InstallArguments>(
          packageNameList.map(packageName => ({
            title: packageName,
            task() {
              const pkg = new TemplatePackage(packageName, baseDir);
              return new Listr<InstallArguments>([
                {
                  title: 'Initialize',
                  task: () => pkg.initialize(),
                },
                {
                  title: 'Clone via git',
                  task: () => pkg.clone(),
                },
                {
                  title: 'Install dependencies',
                  task: () => pkg.installPlugins(),
                },
                {
                  title: 'Fetch files',
                  task: () => pkg.fetch(),
                },
                {
                  title: 'Patch files',
                  task: () => pkg.patch(),
                },
                {
                  title: 'Write files',
                  task: () => pkg.install(ctx.withExample),
                },
                {
                  title: 'Cleanup',
                  task: () => pkg.cleanup(),
                },
              ]);
            },
          }))
        );
      },
    },
  ]);

  @autobind()
  builder(yargs: Argv) {
    return yargs.demandCommand(1).options({
      withExample: {
        alias: 'w',
        describe: 'Install with example',
        default: false,
        type: 'boolean',
      },
    });
  }
}

export default new Install();
