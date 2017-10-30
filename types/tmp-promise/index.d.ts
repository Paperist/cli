declare module 'tmp-promise' {
  import * as tmp from 'tmp';
  export { Options, SimpleOptions, SynchrounousResult } from 'tmp';
  export interface AynchrounousResult {
    path: string;
    fd?: number;
    cleanup(): void;
  }

  export function file(config?: tmp.Options): Promise<AynchrounousResult>;
  export function withFile(config?: tmp.Options): Promise<AynchrounousResult>;
  export function fileSync(config?: tmp.Options): tmp.SynchrounousResult;
  export function dir(config?: tmp.Options): Promise<AynchrounousResult>;
  export function withDir(config?: tmp.Options): Promise<AynchrounousResult>;
  export function dirSync(config?: tmp.Options): tmp.SynchrounousResult;
  export function tmpName(config?: tmp.SimpleOptions): string;
  export function tmpNameSync(config?: tmp.SimpleOptions): string;
  export function setGracefulCleanup(): void;
}
