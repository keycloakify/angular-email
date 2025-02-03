import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

@Component({
  selector: 'ng-email-container',
  template: `
    @let containerWidth = $containerWidth();
    @let alignment = $alignment();

    <div [style]="{ tableLayout: 'fixed', width: '100%' }">
      <div [style]="{ margin: '0 auto', maxWidth: containerWidth }">
        <noscript [attr.data-html]="$innerHtmlPre()"></noscript>
        <table
          [align]="alignment"
          [width]="'100%'"
          role="presentation"
          [cellSpacing]="0"
          [cellPadding]="0"
          [border]="0"
          [style]="$style()"
        >
          <tbody>
            <tr [style]="$trStyle()">
              <td [align]="alignment">
                <ng-content></ng-content>
              </td>
            </tr>
          </tbody>
        </table>
        <noscript [attr.data-html]="$innerHtmlPost()"></noscript>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ContainerComponent {
  random = Math.random();
  document = inject(DOCUMENT);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $containerStyle = input<Record<string, any> | null | undefined>(null, { alias: 'containerStyle' });
  $alignment = input('center', { alias: 'alignment' });
  $disableDefaultStyle = input(false, { alias: 'disableDefaultStyle' });
  $containerWidth = input(600, { alias: 'containerWidth' });

  $style = computed(() => ({
    ...(this.$disableDefaultStyle() ? {} : { maxWidth: `${this.$containerWidth()}px` }),
    ...this.$containerStyle(),
  }));

  $trStyle = computed(() => ({
    ...(this.$disableDefaultStyle() ? {} : { width: '100%' }),
  }));

  $innerHtmlPre = computed(
    () =>
      `<!--[if mso]><table align="${this.$alignment()}" width="${this.$containerWidth()}" style="border-spacing: 0; width:${this.$containerWidth()}px;" role="presentation"><tr><td><![endif]-->`,
  );

  $innerHtmlPost = computed(() => `<!--[if mso]></td></tr></table><![endif]-->`);
}
