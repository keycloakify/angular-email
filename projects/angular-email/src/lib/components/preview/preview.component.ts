import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-preview',
  templateUrl: 'preview.component.html',
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
