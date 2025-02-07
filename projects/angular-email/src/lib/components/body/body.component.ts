import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ng-email-body',
  templateUrl: 'body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyComponent {}
