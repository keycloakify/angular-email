import { ChangeDetectionStrategy, Component, input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConditionalComponent } from './conditional.component';

@Component({
  selector: 'ng-email-head',
  template: `
    @let enableFormatDetection = $enableFormatDetection();

    <head>
      <meta
        http-equiv="content-type"
        content="text/html; charset=UTF-8"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=yes"
      />
      <meta name="x-apple-disable-message-reformatting" />
      @if (!enableFormatDetection) {
        <meta
          name="format-detection"
          content="telephone=no, date=no, address=no, email=no, url=no"
        />
      }
      <ng-content></ng-content>
      <ng-email-conditional [mso]="true">
        <noscript [attr.data-html]="xml"></noscript>
      </ng-email-conditional>
    </head>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ConditionalComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HeadComponent {
  $enableFormatDetection = input(false, { alias: 'enableFormatDetection' });
  xml = `\n<xml><o:OfficeDocumentSettings><o:AllowPNG /><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>\n`;
}
