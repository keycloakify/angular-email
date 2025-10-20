import { build } from 'esbuild';
import { join } from 'node:path';

await build({
  entryPoints: [join(import.meta.dirname, '*.ts')],
  absWorkingDir: import.meta.dirname,
  allowOverwrite: true,
  bundle: false,
  format: 'esm',
  platform: 'node',
  sourcemap: false,
  minify: true,
  packages: 'external',
  tsconfig: join(import.meta.dirname, 'tsconfig.json'),
  outdir: '../../../dist/angular-email/bin',
  // outExtension: { '.js': '.mjs' },
});
