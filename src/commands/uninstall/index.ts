import { Arguments } from 'yargs';
import * as Listr from 'listr';
import Command from '../Command';
import findBaseDir from '../../utils/findBaseDir';
import Package from '../../utils/Package';

interface UninstallArguments extends Arguments {
  quiet: boolean;
}

class Uninstall extends Command<UninstallArguments> {
  public command = 'uninstall';
  public describe = '';

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
              const pkg = new Package(packageName, baseDir);
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
}

export default new Uninstall();
