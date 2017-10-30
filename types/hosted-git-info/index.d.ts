declare module 'hosted-git-info' {
  namespace hostedGitInfo {
    interface Options {
      /**
     * If true then committishes won't be included in generated URLs.
     */
      noCommittish?: boolean;
      /**
     * If true then git+ won't be prefixed on URLs.
     */
      noGitPlus?: boolean;
    }

    interface Result {
      /**
     * The short name of the service
     */
      type: string;
      /**
     * The domain for git protocol use
     */
      domain: string;
      /**
     * The name of the user/org on the git host
     */
      user: string;
      /**
     * The name of the project on the git host
     */
      project: string;

      file(path: string, opts?: Options): string;
      shortcut(opts?: Options): string;
      browse(opts?: Options): string;
      bugs(opts?: Options): string;
      docs(opts?: Options): string;
      https(opts?: Options): string;
      sshurl(opts?: Options): string;
      ssh(opts?: Options): string;
      path(opts?: Options): string;
      tarball(opts?: Options): string;
      getDefaultRepresentation(): string;
      toString(opts?: Options): string;
    }
  }

  interface hostedGitInfo {
    fromUrl(gitSpecifier: string, options?: hostedGitInfo.Options): hostedGitInfo.Result | undefined;
  }
  var hostedGitInfo: hostedGitInfo;

  export = hostedGitInfo;
}
