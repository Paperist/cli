import * as path from 'path';
import * as fs from 'fs-extra';
import execa = require('execa');

export default async function clean(cwd: string) {
  await execa('latexmk', ['-quiet', '-C', '-cd', '.paperist/main'], { cwd, shell: true as any });
  await fs.remove(path.resolve(cwd, './.paperist/dist'));
  await fs.remove(path.resolve(cwd, './build.pdf'));
}
