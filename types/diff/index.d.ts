import * as JsDiff from 'diff';

declare module 'diff' {
  function applyPatch(
    oldStr: string,
    uniDiff: string | JsDiff.IUniDiff | JsDiff.IUniDiff[],
    options: {
      compareLine(lineNumber: number, line: string, operation: '+' | '-' | ' ', patchContent: string): boolean;
    }
  ): string;
}
