import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { styleToString } from '../../utils';

@Component({
  selector: 'ng-email-section',
  templateUrl: 'section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class SectionComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $sectionStyle = input<Record<string, any> | null | undefined>(null, { alias: 'sectionStyle' });
  $style = computed(() => {
    return styleToString({
      width: '100%',
      ...(this.$sectionStyle() ?? {}),
    });
  });
}
