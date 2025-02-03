import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-email-column',
  template: `
    <td
      [attr.background]="$bgImage()"
      [attr.bgcolor]="$bgColor()"
      [style]="$columnStyle()"
      role="presentation"
    >
      <ng-content />
    </td>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ColumnComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $columnStyle = input<Record<string, any> | null | undefined>(null, { alias: 'columnStyle' });
  $bgImage = input<string>(undefined, { alias: 'bgImage' });
  $bgColor = input<string>(undefined, { alias: 'bgColor' });
}
