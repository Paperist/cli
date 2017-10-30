import { Arguments } from 'yargs';
import * as Listr from 'listr';
import Command from '../Command';
import findBaseDir from '../../utils/findBaseDir';
import clean from '../../utils/clean';

interface CleanArguments extends Arguments {
  quiet: boolean;
}

class Clean extends Command<CleanArguments> {
  public command = 'clean';
  public describe = '';

  public tasks = new Listr<CleanArguments>([
    {
      title: 'Cleanup',
      async task(_ctx, _task) {
        await clean(await findBaseDir());
      },
    },
  ]);
}

export default new Clean();
