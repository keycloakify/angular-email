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
import { render } from '@keycloakify/angular-email';

...
export class EmailComponent {
  ....
}

export const renderToHtml = () => {
  return render({
    component: EmailComponent,
    selector: 'app-root',
    props: {},
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
            external: ['@maizzle/framework'],
            plugins: [angularEsbuildPlugin(import.meta.dirname)],
          },
        });
      },
    }),
  ],
}));
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request on [GitHub](https://github.com/keycloakify/angular-email).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [jsx-email](https://github.com/rezqio/jsx-email)
- Builded with [@maizzle/framework](https://github.com/maizzle/framework)
- Developed by [Luca Peruzzo](https://github.com/luca-peruzzo)
