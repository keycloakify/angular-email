import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-text',
  templateUrl: 'text.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $textStyle = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            fontSize: '14px',
            lineHeight: '24px',
            margin: '16px 0',
          }),
      ...(this.$style() ?? {}),
    };
  });
}
