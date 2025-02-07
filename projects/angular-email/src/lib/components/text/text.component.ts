import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-text',
  templateUrl: 'text.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $textStyle = input<Record<string, any> | null | undefined>(null, { alias: 'textStyle' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $style = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            fontSize: '14px',
            lineHeight: '24px',
            margin: '16px 0',
          }),
      ...(this.$textStyle() ?? {}),
    };
  });
}
