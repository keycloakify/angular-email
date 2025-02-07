import { ChangeDetectionStrategy, Component, input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConditionalComponent } from '../conditional/conditional.component';

@Component({
  selector: 'ng-email-head',
  templateUrl: 'head.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConditionalComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HeadComponent {
  $enableFormatDetection = input(false, { alias: 'enableFormatDetection' });
  xml = `\n<xml><o:OfficeDocumentSettings><o:AllowPNG /><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>\n`;
}
