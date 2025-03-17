import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-email-row',
  templateUrl: 'row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class RowComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
  $disableDefaultStyle = input(false, { alias: 'disableDefaultStyle' });
}
