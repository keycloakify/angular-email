import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-email-body',
  templateUrl: 'body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
}
