import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-email-column',
  templateUrl: 'column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class ColumnComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $columnStyle = input<Record<string, any> | null | undefined>(null, { alias: 'columnStyle' });
  $bgImage = input<string>(undefined, { alias: 'bgImage' });
  $bgColor = input<string>(undefined, { alias: 'bgColor' });
}
