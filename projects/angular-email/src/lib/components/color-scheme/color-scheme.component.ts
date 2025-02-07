import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ColorSchemeMode =
  | 'dark'
  /**
   * The email client will only ever render the content in the dark color scheme and forbids the
   * email client from overriding the color scheme.
   */
  | 'dark only'
  | 'light'
  /**
   * The email client will choose the light or dark theme to match the user’s preference.
   * If the user’s preference does not match something in the list, the email client will choose
   * which mode to display.
   */
  | 'light dark'
  /**
   * The email client will choose the first of the listed schemes that it supports taking user
   * preference into account and forbids the email client from overriding the color scheme.
   */
  | 'light dark only'
  /**
   * The email client will only ever render the content in the light color scheme and forbids the
   * email client from overriding the color scheme.
   */
  | 'light only'
  /**
   * Indicates that the email supports the page’s supported color schemes, if they are set, or
   * that it supports no color schemes at all otherwise.
   */
  | 'normal';

@Component({
  selector: 'ng-email-color-scheme',
  templateUrl: 'color-scheme.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSchemeComponent {
  $mode = input<ColorSchemeMode>('normal', { alias: 'mode' });
  $style = computed(
    () => `<style>:root { color-scheme: ${this.$mode()}; supported-color-schemes: ${this.$mode()}; }</style>`,
  );
}
