import { build } from 'esbuild';
import { join } from 'node:path';

await build({
  entryPoints: [join(import.meta.dirname, 'index.ts')],
  absWorkingDir: import.meta.dirname,
  allowOverwrite: true,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  sourcemap: false,
  minify: true,
  packages: 'external',
  outfile: '../../../dist/angular-email/node/index.cjs',
});

await build({
  entryPoints: [join(import.meta.dirname, 'index.ts')],
  absWorkingDir: import.meta.dirname,
  allowOverwrite: true,
  bundle: true,
  format: 'esm',
  platform: 'node',
  sourcemap: false,
  minify: true,
  packages: 'external',
  outfile: '../../../dist/angular-email/node/index.js',
});
