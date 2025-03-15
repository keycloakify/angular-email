import esbuild from 'esbuild';
import { join } from 'node:path';

await esbuild.build({
  entryPoints: [join(import.meta.dirname, 'index.ts')],
  absWorkingDir: import.meta.dirname,
  allowOverwrite: true,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  sourcemap: false,
  packages: 'external',
  outfile: 'dist/index.cjs',
});

await esbuild.build({
  entryPoints: [join(import.meta.dirname, 'index.ts')],
  absWorkingDir: import.meta.dirname,
  allowOverwrite: true,
  bundle: true,
  format: 'esm',
  platform: 'node',
  sourcemap: false,
  packages: 'external',
  outfile: 'dist/index.js',
});
