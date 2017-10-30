declare module 'ignore' {
  type IgnorePattern = string | Ignore;
  interface Ignore {
    (): Ignore;
    add(this: Ignore, pattern: IgnorePattern | IgnorePattern[]): this;
    filter(this: Ignore, path: string[]): string[];
    createFilter(this: Ignore): Function;
    ignores(path: string): boolean;
  }
  var Ignore: Ignore;
  export = Ignore;
}
