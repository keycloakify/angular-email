#!/usr/bin/env node

import { angularEsbuildPlugin } from '@keycloakify/angular-email/esbuild';
import esbuild from 'esbuild';
import { Dirent } from 'node:fs';
import { readdir, rm, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { cwd, exit } from 'node:process';
import { pathToFileURL } from 'node:url';
import { termost } from 'termost';
import pkg from '../package.json' with { type: 'json' };

async function bundle(entryPoints: string[], cwd: string, outdir: string) {
  // we have to use a bundler to preprocess templates code
  // It's better to not use the same bundling configuration used for the
  // frontend theme, because for email templates there might be a different
  // transpiling settings, such as other jsx-pragma or additional transpilation plugins,
  const result = await esbuild.build({
    entryPoints: entryPoints,
    bundle: true,
    outdir,
    absWorkingDir: cwd,
    platform: 'node',
    sourcemap: true,
    packages: 'bundle',
    external: ['@maizzle/framework'],
    format: 'esm',
    target: 'node20',
    plugins: [angularEsbuildPlugin(cwd)],
    metafile: true,
  });

  // collect map of entrypoints -> output files
  // esbuild return paths relative to the CWD
  // https://github.com/evanw/esbuild/issues/338
  return Object.entries(result.metafile.outputs).reduce(
    (acc, [filePath, meta]) => {
      if (meta.entryPoint) {
        // Absolute pathes doesn't work on windows.
        // Have to use `pathToFileURL` to convert it to url
        acc[resolve(cwd, meta.entryPoint)] = pathToFileURL(resolve(cwd, filePath)).toString();
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
async function getTemplates(dirPath: string, filterTemplate?: (filePath: string) => boolean) {
  try {
    const recursiveGetFiles = async (path: string): Promise<Dirent[]> => {
      const items = await readdir(path, { withFileTypes: true });
      const dirents: Dirent[] = [];
      for (const item of items) {
        if (item.isFile()) dirents.push(item);
        else if (item.isDirectory()) {
          dirents.push(...(await recursiveGetFiles(join(item.parentPath, item.name))));
        }
      }
      return dirents;
    };
    // Read all items in the directory
    const items = (await recursiveGetFiles(dirPath))
      .map((file) => join(file.parentPath, file.name))
      .filter((filePath) => {
        if (!filterTemplate) return true;
        return filterTemplate(filePath);
      });
    return items;
  } catch (err) {
    console.error(`Error scanning directory: ${(err as Error).message}`);
    throw err;
  }
}

const build = async (emailFilesPath: string, outdir: string = 'dist/emails'): Promise<void> => {
  if (!emailFilesPath) {
    console.error('emailFilesPath is required!');
    exit(1);
  }
  try {
    console.log(`building emails to ${outdir}...`);
    const tmp = join(cwd(), outdir, '.tmp');
    await rm(outdir, { recursive: true, force: true });
    const tpls = await getTemplates(resolve(cwd(), emailFilesPath), (path) => path.endsWith('.ts'));
    if (!tpls.length) {
      console.error('no templates found!');
      exit(1);
    }
    const entryPoints = [...tpls];

    const bundled = await bundle(entryPoints, cwd(), tmp);
    const promises = tpls.map(async (file) => {
      const module = await (import(bundled[file]) as Promise<{ renderToHtml: () => Promise<string> }>);

      console.log(`- ${file}`);

      return { ...module, file };
    });
    const modules = await Promise.all(promises);
    modules.forEach(async (module) => {
      const html = await module.renderToHtml();
      await writeFile(`${outdir}/${basename(module.file).split('.')[0]}.html`, html);
    });
    await rm(tmp, { recursive: true, force: true });
    console.log('\x1b[36m%s\x1b[0m', `build complete!`);
    exit(0);
  } catch (error) {
    console.error(error);
    exit(1);
  }
};

type CliCommandOptions = {
  emailFilesPath: string;
  outDir: string;
};
const program = termost<CliCommandOptions>({
  name: 'keycloakify-angular-email',
  description: 'Keycloakify CLI',
  version: pkg.version,
  onException: (error) => {
    console.error(error);
    process.exit(1);
  },
});

program.option({
  key: 'emailFilesPath',
  name: { long: 'emailFilesPath', short: 'p' },
  description: '',
  defaultValue: '',
});
program.option({
  key: 'outDir',
  name: { long: 'outDir', short: 'o' },
  description: '',
  defaultValue: 'dist/emails',
});
program
  .command({
    name: 'build',
    description: 'build angular components to html',
  })
  .input({
    key: 'emailFilesPath',
    type: 'text',
    defaultValue: undefined,
    label: "what's the path of your email components files?",
    skip(context) {
      return Boolean(context.emailFilesPath);
    },
  })
  .input({
    key: 'outDir',
    type: 'text',
    defaultValue: 'dist/emails',
    label: 'where do you want to output html files?',
    skip(context) {
      return Boolean(context.outDir);
    },
  })
  .task({
    handler: async (context) => {
      await build(context.emailFilesPath, context.outDir);
    },
  });
