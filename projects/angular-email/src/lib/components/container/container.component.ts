import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

@Component({
  selector: 'ng-email-container',
  templateUrl: 'container.component.html',
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
