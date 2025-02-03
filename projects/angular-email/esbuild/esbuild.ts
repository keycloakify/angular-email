import { createCompilerPlugin } from '@angular/build/private';

export const angularEsbuildPlugin = (cwd: string) =>
  createCompilerPlugin(
    {
      browserOnlyBuild: false,
      incremental: false,
      sourcemap: true,
      tsconfig: cwd + '/tsconfig.json',
    },
    {
      cacheOptions: {
        basePath: cwd + '/.angular/cache',
        enabled: false,
        path: cwd + '/.angular/cache/angular-email',
      },
      inlineFonts: false,
      inlineStyleLanguage: 'css',
      optimization: false,
      sourcemap: false,
      target: [],
      workspaceRoot: '',
      outputNames: { bundles: '', media: '' },
    },
  );
