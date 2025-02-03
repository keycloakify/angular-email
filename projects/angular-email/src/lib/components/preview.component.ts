import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-preview',
  template: `
    <div
      id="__angular-email-preview"
      style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0;"
    >
      {{ $preview() }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  $preview = input('', { alias: 'preview' });
  $text = computed(() => {
    const preview = this.$preview();
    const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
    return whiteSpaceCodes.repeat(150 - preview.length);
  });
}
