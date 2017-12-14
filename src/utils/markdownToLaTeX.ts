import * as path from 'path';
import * as fs from 'fs-extra';
import * as unified from 'unified';
import * as VFile from 'vfile';
import * as MarkdownPlugin from 'remark-parse';
import resolveFrom = require('resolve-from');
import * as LaTeXPlugin from '@paperist/remark-latex';
import Config from './Config';
import autoLinkPatch = require('../patches/auto-link');

// Note: https://github.com/remarkjs/remark/pull/293
MarkdownPlugin.Parser.prototype.inlineTokenizers['autoLink'] = autoLinkPatch;

const defaultConfig = {
  templatesDir: '.paperist/ejs',
  imageConfigs: {
    keepaspectratio: true,
    width: '0.9\\linewidth',
    height: '0.25\\paperheight',
  },
};

export default async function markdownToLaTeX(filePath: string, baseDir: string, exportDir?: string) {
  const config = await new Config(baseDir).load();
  const plugins = config.plugins || {};
  const convertConfig = {
    ...defaultConfig,
    ...config,
    imageConfigs: {
      ...defaultConfig.imageConfigs,
      ...(config.imageConfigs || {}),
    },
  };

  if (!exportDir) {
    exportDir = path.dirname(filePath);
  }
  await fs.mkdirp(exportDir);

  let processor = unified()
    .use(MarkdownPlugin)
    .use(LaTeXPlugin)
    .use({
      settings: {
        latex: convertConfig,
      },
    });

  const pluginDir = path.resolve(baseDir, process.platform === 'win32' ? './.paperist' : './.paperist/lib');
  for (const pluginName of Object.keys(plugins)) {
    const requirePath = resolveFrom(pluginDir, pluginName);
    processor = processor.use(require(requirePath), plugins[pluginName]);
  }

  const vfile = VFile({
    contents: await fs.readFile(filePath),
    path: filePath,
  });

  const result = await processor.process(vfile);
  const exportPath = path.resolve(exportDir, result.basename);
  await fs.writeFile(exportPath, result.toString(), { encoding: 'utf8' });
}
