import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { styleToString } from '../utils';

@Component({
  selector: 'ng-email-section',
  template: `
    <table
      [align]="'center'"
      [border]="0"
      [cellPadding]="0"
      [cellSpacing]="0"
      width="100%"
      role="presentation"
      [style]="$style()"
    >
      <tbody>
        <tr>
          <td>
            <ng-content />
          </td>
        </tr>
      </tbody>
    </table>
  `,
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
