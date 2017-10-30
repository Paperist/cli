declare module 'glob-promise' {
  import * as glob from 'glob';

  interface Glob {
    promise(pattern: string, options?: glob.IOptions): Promise<string[]>;
    glob(pattern: string, cb: (err: Error | null, matches: string[]) => void): void;
    glob(pattern: string, options: glob.IOptions, cb: (err: Error | null, matches: string[]) => void): void;
    sync(pattern: string, options?: glob.IOptions): string[];
    hasMagic(pattern: string, options?: glob.IOptions): boolean;
  }
  function Glob(pattern: string, options?: glob.IOptions): Promise<string[]>;
  namespace Glob {
    //
  }

  export = Glob;
}
