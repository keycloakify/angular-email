import { tailwindcssPresetEmail } from '@keycloakify/angular-email/tailwindcss-preset-email';
import { Config } from 'tailwindcss-v3';

export default {
  content: ['./**/*.{html,ts}'],
  presets: [tailwindcssPresetEmail],
  theme: {
    extend: {
      fontFamily: {
        default: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen-Sans',
          'Ubuntu',
          'Cantarell',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
    },
  },
} satisfies Config;
