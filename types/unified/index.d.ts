declare module 'unified' {
  import { UNIST } from 'unist';
  import * as VFile from 'vfile';

  interface Processor {
    use(plugin: any, options?: any): Processor;
    parse(value: string): UNIST.Node;
    parse(file: VFile.VFile): UNIST.Node;
    stringify(node: UNIST.Node, file?: VFile.VFile): string;
    run(node: UNIST.Node, file?: VFile.VFile): Promise<UNIST.Node>;
    run(node: UNIST.Node, done: (err: Error | null, node: UNIST.Node, file: VFile.VFile) => any): void;
    run(
      node: UNIST.Node,
      file: VFile.VFile,
      done: (err: Error | null, node: UNIST.Node, file: VFile.VFile) => any
    ): void;
    runSync(node: UNIST.Node, file?: VFile.VFile): UNIST.Node;
    process(value: string): Promise<VFile.VFile>;
    process(value: string, done: (err: Error | null, file: VFile.VFile) => any): void;
    process(file: VFile.VFile): Promise<VFile.VFile>;
    process(file: VFile.VFile, done: (err: Error | null, file: VFile.VFile) => any): void;
    processSync(value: string): VFile.VFile;
    processSync(file: VFile.VFile): VFile.VFile;
    data(key: string): any;
    data(key: string, value: any): Processor;
    freeze(): Processor;
  }

  function processor(): Processor;
  namespace processor {
    //
  }

  export = processor;
}
