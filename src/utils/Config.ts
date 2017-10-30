import * as fs from 'fs-extra';
import * as path from 'path';
import * as YAML from 'js-yaml';
import * as deepmerge from 'deepmerge';

const defaultConfig = {
  plugins: {},
  templateDir: '.paperist/ejs',
  imageConfigs: {
    keepaspectratio: true,
    width: '0.9\\linewidth',
    height: '0.25\\paperheight',
  },
  documentInfo: {},
};

const configOrder = ['plugins', 'templateDir', 'imageConfigs', 'documentInfo'];

export default class Config {
  constructor(public baseDir: string) {}

  get configFilePath() {
    return path.resolve(this.baseDir, './paperist.config.yml');
  }

  async load() {
    if (!await fs.pathExists(this.configFilePath)) {
      return defaultConfig;
    }
    const _config = YAML.safeLoad(await fs.readFile(this.configFilePath, 'utf8')) || defaultConfig;
    const merged = {
      ...defaultConfig,
      ..._config,
      imageConfigs: {
        ...defaultConfig.imageConfigs,
        ...(_config.imageConfigs || {}),
      },
    };
    return merged;
  }

  async write(opts: any, overwrite = false) {
    const base = await this.load();
    let merged: any;
    if (overwrite) {
      merged = deepmerge(base, opts, { arrayMerge: (_, src) => src });
    } else {
      merged = deepmerge(opts, base, { arrayMerge: (_, src) => src });
    }
    await fs.writeFile(
      this.configFilePath,
      YAML.safeDump(merged, {
        sortKeys: (a: string, b: string) => configOrder.indexOf(a) - configOrder.indexOf(b),
        skipInvalid: true,
      }),
      { encoding: 'utf8' }
    );
  }
}
