#!/usr/bin/env node

import { exit } from 'node:process';
import { termost } from 'termost';
import pkg from '../package.json' with { type: 'json' };
import { build } from './build.js';

type CliCommandOptions = {
  emailFilesPath: string;
  outDir: string;
  externals?: string;
};
const program = termost<CliCommandOptions>({
  name: 'keycloakify-angular-email',
  description: 'Keycloakify CLI',
  version: pkg.version,
  onException: (error) => {
    console.error(error);
    exit(1);
  },
});

program.option({
  key: 'emailFilesPath',
  name: { long: 'emailFilesPath', short: 'p' },
  description: 'input directory for angular email components',
  defaultValue: '',
});
program.option({
  key: 'outDir',
  name: { long: 'outDir', short: 'o' },
  description: 'output directory for generated html',
  defaultValue: 'dist/emails',
});
program.option({
  key: 'externals',
  name: { long: 'externals', short: 'e' },
  description: 'Comma-separated packages to mark as external in esbuild (e.g. tailwindcss,postcss,postcss-calc)',
  defaultValue: '',
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
  .input({
    key: 'externals',
    type: 'text',
    label: 'any additional package to mark as external (comma separated)?',
    skip() {
      return true;
    },
  })
  .task({
    handler: async (context) => {
      let externals: string[] = [];
      if (context.externals) {
        externals = context.externals
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
      }
      await build(context.emailFilesPath, context.outDir, externals);
    },
  });
