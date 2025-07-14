import { ChangeDetectionStrategy, Component, computed, inject, input, DOCUMENT } from '@angular/core';

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
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
  $alignment = input('center', { alias: 'alignment' });
  $disableDefaultStyle = input(false, { alias: 'disableDefaultStyle' });
  $containerWidth = input(600, { alias: 'containerWidth' });

  $containerStyle = computed(() => ({
    ...(this.$disableDefaultStyle() ? {} : { maxWidth: `${this.$containerWidth()}px` }),
    ...this.$style(),
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
