# Angular Email

Angular Email is a library that enables email template development using Angular, inspired by [jsx-email](https://github.com/rezqio/jsx-email). It provides a way to create email components using Angular's templating system.

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
...
import { render } from '@keycloakify/angular-email';

const emailHtml = render({
  component: AppComponent,
  selector: 'app-root',
  options: {
    pretty: true,
  },
}).then((emailHtml) => {
  console.log(emailHtml);
});
```

### With Keycloakify Emails

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
          filterTemplate: (filePath: string) => !filePath.endsWith('.html'),
          themeNames: buildContext.themeNames,
          keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
          locales: ['en'],
          cwd: import.meta.dirname,
          esbuild: {
            packages: 'bundle',
            external: ['cheerio'],
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
- Developed by [Luca Peruzzo](https://github.com/luca-peruzzo)
