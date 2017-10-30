declare module 'listr' {
  import { Observable } from 'rxjs';

  interface Task {
    title: string;
    output: string;
    skip(message: string): void;
  }

  interface TaskDefine<Context> {
    title: string;
    task(ctx: Context, task: Task): Promise<any> | Observable<any> | NodeJS.ReadableStream | Listr<Context> | void;
    skip?(ctx: Context): Promise<string | void> | string | void;
    enabled?(ctx: Context): boolean;
  }

  interface ListrOptions {
    concurrent?: boolean | number;
    exitOnError?: boolean;
    renderer?: string | object;
    nonTTYRenderer?: string | object;
  }

  class Listr<Context> {
    constructor(tasks: TaskDefine<Context>[], opts?: ListrOptions);
    add(tasks: TaskDefine<Context>[]): this;
    run(context?: Context): Promise<Context>;
  }
  namespace Listr {
    //
  }

  export = Listr;
}
