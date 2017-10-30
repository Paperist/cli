import { Argv, Arguments } from 'yargs';
import * as Listr from 'listr';
import { autobind } from 'core-decorators';
import Command from '../../Command';
import findBaseDir from '../../../utils/findBaseDir';
import TemplatePackage from '../../../utils/TemplatePackage';

interface UninstallArguments extends Arguments {
  quiet: boolean;
}

class Uninstall extends Command<UninstallArguments> {
  public command = 'uninstall';
  public describe = "Uninstall template's dependencies";
  public aliases = ['remove'];

  public tasks = new Listr<UninstallArguments>([
    {
      title: 'Uninstall',
      async task(ctx, _task) {
        const [, ...packageNameList] = ctx._;
        if (packageNameList.length === 0) {
          return;
        }
        const baseDir = await findBaseDir();
        return new Listr<UninstallArguments>(
          packageNameList.map(packageName => ({
            title: packageName,
            task() {
              const pkg = new TemplatePackage(packageName, baseDir);
              return new Listr<UninstallArguments>([
                {
                  title: 'Initialize',
                  task: () => pkg.initialize(),
                },
                {
                  title: 'Clone via git',
                  task: () => pkg.clone(),
                },
                {
                  title: 'Uninstall dependencies',
                  task: () => pkg.uninstallPlugins(),
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
    return yargs.demandCommand(1);
  }
}

export default new Uninstall();
