import * as fs from 'fs-extra';
import * as path from 'path';
import hostedGitInfo = require('hosted-git-info');
import * as tmp from 'tmp-promise';
import * as simpleGit from 'simple-git/promise';
import * as YAML from 'js-yaml';
import axios from 'axios';
import * as JSZip from 'jszip';
import * as iconv from 'iconv-lite';
import * as glob from 'glob-promise';
import * as JsDiff from 'diff';
import * as ig from 'ignore';
import * as npm from 'npm';
import devNull = require('dev-null');
import Config from './Config';
import templateIgnoreString from './ignore/template';
import exampleIgnoreString from './ignore/example';

const installConfigList = [
  { overwrite: true, ignore: ig().add(templateIgnoreString) },
  { overwrite: false, ignore: ig().add(exampleIgnoreString) },
];

export interface TemplatePackageConfig {
  name: string;
  plugins?: {
    [pluginName: string]: any;
  };
  fetch?: {
    url: string;
    files: string[];
    encoding?: string;
  }[];
}

export default class TemplatePackage {
  public gitInfo: hostedGitInfo.Result;
  public tmpInfo: tmp.AynchrounousResult;
  public config: TemplatePackageConfig;
  public projectConfig: Config;

  constructor(public packageName: string, public baseDir: string) {
    const info = hostedGitInfo.fromUrl(packageName);
    if (!info) {
      throw new Error(`"${packageName}" is an invalid`);
    }
    this.gitInfo = info;
    this.projectConfig = new Config(baseDir);
  }

  get tmpPath() {
    return this.tmpInfo.path;
  }

  get paperistPath() {
    return path.resolve(this.tmpPath, './.paperist');
  }

  get templatePath() {
    return path.resolve(this.paperistPath, './templates');
  }

  async initialize() {
    tmp.setGracefulCleanup();
    this.tmpInfo = await tmp.dir({ prefix: 'paperist-', unsafeCleanup: true });

    await new Promise((resolve, reject) =>
      npm.load(
        {
          global: true,
          progress: false,
          loglevel: 'silent',
          logstream: devNull(),
          prefix: path.resolve(this.baseDir, './.paperist'),
        } as any,
        err => (err ? reject(err) : resolve())
      )
    );
  }

  async cleanup() {
    this.tmpInfo.cleanup();
  }

  async clone() {
    const info = this.gitInfo;
    const git = simpleGit(process.cwd());
    await git.clone(info.https({ noGitPlus: true }), this.tmpPath);
    await fs.remove(path.resolve(this.tmpPath, './.git'));

    const pluginConfigPath = path.resolve(this.tmpPath, './paperist.plugin.yml');
    if (!await fs.pathExists(pluginConfigPath)) {
      throw new Error(`"${info.https()}" hasn't "paperist.plugin.yml"`);
    }
    this.config = YAML.safeLoad(await fs.readFile(pluginConfigPath, 'utf8'));
  }

  async fetch() {
    if (!this.config.fetch) {
      return false;
    }

    for (const fetch of this.config.fetch) {
      const { data } = (await axios.get(fetch.url, { responseType: 'arraybuffer' })) as { data: ArrayBuffer };
      const zip = await new JSZip().loadAsync(data);
      const fileList = zip.filter(path => fetch.files.includes(path));
      for (const file of fileList) {
        const buffer = await file.async('nodebuffer');
        const fileName = path.basename(file.name);
        const filePath = path.resolve(this.templatePath, `./${fileName}`);
        if (fetch.encoding) {
          const decoded = iconv.decode(buffer, fetch.encoding);
          await fs.writeFile(filePath, decoded, { encoding: 'utf8' });
        } else {
          await fs.writeFile(filePath, buffer);
        }
      }
    }
    return true;
  }

  async patch() {
    const patchFiles = await glob(path.resolve(this.templatePath, './*.patch'));
    if (patchFiles.length === 0) {
      return false;
    }

    for (const patchFile of patchFiles) {
      const patchPath = path.resolve(this.templatePath, path.basename(patchFile));
      const filePath = path.resolve(this.templatePath, path.basename(patchFile, '.patch'));
      if (!fs.existsSync(filePath)) {
        continue;
      }
      const original = await fs.readFile(filePath, 'utf8');
      const patchObj = JsDiff.parsePatch(await fs.readFile(patchPath, 'utf8'));
      const patched = JsDiff.applyPatch(original, patchObj, {
        compareLine(_lineNumber, line, _operation, patchContent) {
          return line.trim() === patchContent.trim();
        },
      });
      await fs.writeFile(filePath, patched, { encoding: 'utf8' });
    }
    return true;
  }

  async install(overwrite = false) {
    for (const config of installConfigList) {
      await fs.copy(this.tmpPath, this.baseDir, {
        overwrite: config.overwrite || overwrite,
        filter: src => {
          if (path.isAbsolute(src)) {
            src = path.relative(this.tmpPath, src);
          }
          const allow = !config.ignore.ignores(src);
          // Allow root dir and not ignored.
          return allow || src === '';
        },
      });
    }

    const configFilePath = path.resolve(this.tmpPath, './paperist.config.yml');
    await this.projectConfig.write(YAML.safeLoad(await fs.readFile(configFilePath, 'utf8')), overwrite);
  }

  async installPlugins() {
    if (!this.config.plugins) {
      return false;
    }
    const pluginNameList = Object.keys(this.config.plugins);
    await new Promise((resolve, reject) =>
      npm.commands.install(pluginNameList, err => (err ? reject(err) : resolve()))
    );
    await this.projectConfig.write({ plugins: this.config.plugins }, true);
    return true;
  }

  async uninstallPlugins() {
    if (!this.config.plugins) {
      return false;
    }
    const pluginNameList = Object.keys(this.config.plugins);
    await new Promise((resolve, reject) =>
      npm.commands.uninstall(pluginNameList, err => (err ? reject(err) : resolve()))
    );

    const pluginsConfig = (await this.projectConfig.load()).plugins || {};
    for (const name of pluginNameList) {
      pluginsConfig[name] = undefined;
    }
    await this.projectConfig.write({ plugins: pluginsConfig }, true);
    return true;
  }
}
