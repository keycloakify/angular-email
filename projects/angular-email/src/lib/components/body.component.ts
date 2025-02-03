import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ng-email-body',
  template: `
    <body>
      <ng-content />
    </body>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent {}
