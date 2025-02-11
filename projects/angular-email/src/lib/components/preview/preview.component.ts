import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RawComponent } from '../raw/raw.component';

@Component({
  selector: 'ng-email-preview',
  templateUrl: 'preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RawComponent],
})
export class PreviewComponent {
  $preview = input('', { alias: 'preview' });

  maxLength = 150;
  $text = computed(() => {
    const preview = this.$preview();
    if (preview.length >= this.maxLength) return null;
    const whiteSpaceCodes = '&nbsp;&#x200c;&#x200b;&#x200d;&#x200e;&#x200f;&#xfeff;';
    return whiteSpaceCodes.repeat(this.maxLength - preview.length);
  });
}
