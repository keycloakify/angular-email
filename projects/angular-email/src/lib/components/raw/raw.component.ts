import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { escapeForRawComponent } from '../../utils';

@Component({
  selector: 'ng-email-raw',
  templateUrl: 'raw.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RawComponent {
  $disablePlainTextOutput = input(false, { alias: 'disablePlainTextOutput' });
  $content = input('', { alias: 'content' });
  $escapingContent = computed(() => `<!--${escapeForRawComponent(this.$content())}-->`);
}
