import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-preview',
  templateUrl: 'preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  $preview = input('', { alias: 'preview' });

  maxLength = 150;
  $text = computed(() => {
    const preview = this.$preview();
    if (preview.length >= this.maxLength) return null;
    const whiteSpaceCodes = '\u00A0\u200C\u200B\u200D\u200E\u200F\uFEFF';
    return whiteSpaceCodes.repeat(this.maxLength - preview.length);
  });
}
