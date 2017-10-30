import { Argv, Arguments } from 'yargs';
import { autobind } from 'core-decorators';
import Command from '../Command';
import install from './install';
import uninstall from './uninstall';

interface TemplateArguments extends Arguments {
  quiet: boolean;
}

class Template extends Command<TemplateArguments> {
  public command = 'template';
  public describe = 'Install/Uninstall template package';

  @autobind()
  builder(yargs: Argv) {
    return yargs
      .command(install)
      .command(uninstall)
      .demandCommand(1)
      .strict();
  }
}

export default new Template();
