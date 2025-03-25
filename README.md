# Angular Email

Angular Email is a library that enables email template development using Angular, inspired by [jsx-email](https://github.com/shellscape/jsx-email). It provides a way to create email components using Angular's templating system.

## Installation

To install Angular Email, use npm or yarn:

```sh
npm install @keycloakify/angular-email
# or
yarn add @keycloakify/angular-email
```

## Usage

### Creating an Email Component

see this [example](https://github.com/keycloakify/angular-email/blob/main/projects/showcase/src/app/app.component.ts)

### Rendering the Email

To render the email as HTML or plaintext, use Angular's rendering engine:

```typescript
// email.component.ts
...
import { render, RenderToHtml } from '@keycloakify/angular-email';

...
export class EmailComponent {
  ....
}

type EmailComponentProps = {};

export const renderToHtml: RenderToHtml<EmailComponentProps> = (props) => {
  return render({
    component: EmailComponent,
    selector: 'app-root',
    props,
    options: {
      pretty: true,
    },
  });
};
```

```sh
# cmd

export $EMAIL_COMPONENTS_DIR_PATH="src/emails"
npx keycloakify-angular-email build -p $EMAIL_COMPONENTS_DIR_PATH
```

NB: use `keycloakify-angular-email build` when you don't need to pass dynamic inputs to your components, otherwise see [Standalone Dynamic Rendering](#standalone-dynamic-rendering)

### With Keycloakify Emails

```ts
// email.component.ts
...
import { render } from '@keycloakify/angular-email';
import type { GetSubject, GetTemplate } from 'keycloakify-emails';

...
export class EmailComponent {
  ....
}

export const getTemplate: GetTemplate = async (props) => {
  return await render({
    component: EmailComponent,
    props,
    selector: 'kc-email-test',
    options: {
      signalInputsPrefix: '$',
      pretty: true,
      plainText: props.plainText,
    },
  });
};

export const getSubject: GetSubject = async (_props) => {
  return '[KEYCLOAK] - SMTP test message';
};
```

```ts
// vite.config.ts

...
import { buildEmailTheme } from 'keycloakify-emails';
import { angularEsbuildPlugin } from '@keycloakify/angular-email/esbuild';

export default defineConfig(({ mode }) => ({
  ...
  plugins: [
    angular(),
    keycloakify({
      ...
      postBuild: async (buildContext) => {
        await buildEmailTheme({
          templatesSrcDirPath: join(import.meta.dirname, '/emails/templates'),
          filterTemplate: (filePath: string) => !!filePath.endsWith('.component.ts'),
          themeNames: buildContext.themeNames,
          keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
          locales: ['en'],
          cwd: import.meta.dirname,
          esbuild: {
            packages: 'bundle',
            external: ['juice', 'postcss'],
            format: 'cjs',
            outExtension: { '.js': '.cjs' },
            plugins: [angularEsbuildPlugin(import.meta.dirname)],
          },
        });
      },
    }),
  ],
}));
```

### Standalone Dynamic Rendering

Use it in a server environment

```js
// index.mjs

import { toHTML } from '@keycloakify/angular-email/node';

toHTML({
  filePath: 'path/to/your.component.ts',
  props: { foo: 'bar' },
})
  .then((html) => {
    console.log(html);
  })
  .catch((e) => {
    console.error(e);
  });
```

or

```js
// index.cjs

const { toHTML } = require('@keycloakify/angular-email/node');

toHTML({
  filePath: 'path/to/your.component.ts',
  props: { foo: 'bar' },
})
  .then((html) => {
    console.log(html);
  })
  .catch((e) => {
    console.error(e);
  });
```

```sh
# cmd

node index.mjs # or node index.cjs
```

## API

### @keycloakify/angular-email

### Render

```ts
type Render<Input extends Record<string, any>> = {
  component: Type<unknown>;
  /** Component selector */
  selector: string;
  /** Component inputs */
  props?: Input;
  options?: {
    /** render as text */
    plainText?: boolean;
    /** format the html output */
    pretty?: boolean;
    /** tailwind configuration object */
    tailwindConfig?: Partial<Config>;
    /** if you use prefix conventions on signal inputs */
    signalInputsPrefix?: string;
  };
};
```

### render()

```ts
render<Input extends Record<string, any>>({ component, selector, props, options }: Render<Input>) => Promise<string>
```

### @keycloakify/angular-email/esbuild

### angularEsbuildPlugin()

```ts
angularEsbuildPlugin(cwd: string) => Plugin
```

### @keycloakify/angular-email/node

### toHTML()

```ts
toHTML<Input extends Record<string, any>>(options: {
    filePath: string;
    props?: Input;
    root?: string;
}) => Promise<string>
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request on [GitHub](https://github.com/keycloakify/angular-email).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [jsx-email](https://github.com/rezqio/jsx-email)
- Developed by [Luca Peruzzo](https://github.com/luca-peruzzo)
