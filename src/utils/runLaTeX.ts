import * as path from 'path';
import * as fs from 'fs-extra';
import execa = require('execa');

export default async function runLaTeX(cwd: string) {
  await execa('latexmk', ['-quiet', '-cd', '.paperist/main'], { cwd, shell: true as any });
  await fs.move(path.resolve(cwd, './.paperist/main.pdf'), path.resolve(cwd, './build.pdf'), {
    overwrite: true,
  });
  await execa('latexmk', ['-quiet', '-C', '-cd', '.paperist/main'], { cwd, shell: true as any });
}
