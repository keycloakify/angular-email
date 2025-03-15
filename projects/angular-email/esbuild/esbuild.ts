import { createCompilerPlugin } from '@angular/build/private';
import { Plugin } from 'esbuild';

export const angularEsbuildPlugin = (cwd: string): Plugin =>
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
      optimization: true,
      sourcemap: false,
      target: [],
      workspaceRoot: cwd,
      outputNames: { bundles: '', media: '' },
    },
  ) as unknown as Plugin;
