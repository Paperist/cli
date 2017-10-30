declare module 'vfile' {
  import { UNIST } from 'unist';

  namespace VFile {
    interface VFile {
      contents: Buffer | string | null;
      cwd: string;
      path: string;
      basename: string;
      stem: string;
      extname: string;
      dirname: string;
      history: string[];
      messages: VFileMessage[];
      data: any;

      toString(encoding?: string): string;
      message(
        reason: string | Error,
        position?: UNIST.Node | UNIST.Position | UNIST.Location,
        ruleId?: string
      ): VFileMessage;
      info(
        reason: string | Error,
        position?: UNIST.Node | UNIST.Position | UNIST.Location,
        ruleId?: string
      ): VFileMessage;
      fail(reason: string | Error, position?: UNIST.Node | UNIST.Position | UNIST.Location, ruleId?: string): void;
    }

    type VFileOptions = {
      contents?: Buffer | string | null;
      cwd?: string;
      path?: string;
      basename?: string;
      stem?: string;
      extname?: string;
      dirname?: string;
      history?: string[];
      messages?: VFileMessage[];
      data?: any;
    };

    type VFileMessage = {
      file: string;
      reason: string;
      ruleId?: string;
      source?: string;
      stack?: string;
      fatal?: boolean;
      line?: number;
      column?: number;
      location?: UNIST.Location;
    };
  }
  function VFile(): VFile.VFile;
  function VFile(value: Buffer | string): VFile.VFile;
  function VFile(opts: VFile.VFileOptions): VFile.VFile;

  export = VFile;
}
