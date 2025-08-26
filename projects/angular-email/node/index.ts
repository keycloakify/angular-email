/* eslint-disable @typescript-eslint/no-explicit-any */
import { angularEsbuildPlugin } from '@keycloakify/angular-email/esbuild';
import { build } from 'esbuild';
import { rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { cwd, exit } from 'node:process';
import { pathToFileURL } from 'node:url';

export const toHTML = async <Input extends Record<string, any>>(options: {
  filePath: string;
  props?: Input;
  root?: string;
  externals?: string[];
}) => {
  /** disable angular log */
  const log = console.log;
  console.log = function (...data: unknown[]) {
    if (data[0] === 'Angular is running in development mode.') return;
    return console.info(...data);
  };
  const { filePath, props, root, externals = [] } = options;
  try {
    const start = new Date();
    const basePath = root ?? cwd();
    const outdir = join(basePath, '.tmp/emails');
    const result = await build({
      logLevel: 'warning',
      entryPoints: [filePath],
      bundle: true,
      splitting: true,
      outdir,
      absWorkingDir: basePath,
      platform: 'node',
      sourcemap: false,
      minify: true,
      packages: 'bundle',
      external: ['juice', ...externals],
      format: 'esm',
      outExtension: { '.js': '.mjs' },
      target: 'node20',
      plugins: [angularEsbuildPlugin(basePath)],
      metafile: true,
    });
    const outputs = Object.entries(result.metafile.outputs);
    const abs = (p: string) => resolve(basePath, p);
    const wanted = abs(filePath);
    const entry = outputs.find(([, info]) => info.entryPoint && abs(info.entryPoint) === wanted)?.[0];
    if (!entry)
      throw new Error(
        `Failed to locate entry output for "${filePath}". ` +
          `Looked for an output whose info.entryPoint resolves to ${wanted}.`,
      );
    const outputFilePath = pathToFileURL(abs(entry)).toString();
    const module = await (import(outputFilePath) as Promise<{ renderToHtml: (props?: Input) => Promise<string> }>);
    const html = await module.renderToHtml(props);
    await rm(outdir, { recursive: true, force: true });
    const end = new Date();
    const seconds = (end.getTime() - start.getTime()) / 1000;
    const filename = filePath.split('/').pop();
    console.log('\x1b[36m%s\x1b[0m', `rendered ${filename} to html in ${seconds}s`);
    return html;
  } catch (e) {
    console.error(e);
    exit(1);
  } finally {
    console.log = log;
  }
};
