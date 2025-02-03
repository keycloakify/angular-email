import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-email-html',
  template: `
    @let enableVML = $enableVML();
    @let lang = $lang();
    @let dir = $dir();

    <html
      id="__angular-email"
      [lang]="lang"
      [dir]="dir"
      [attr.xmlns:o]="enableVML ? 'urn:schemas-microsoft-com:office:office' : undefined"
      [attr.xmlns:v]="enableVML ? 'urn:schemas-microsoft-com:vml' : undefined"
    >
      <ng-content />
    </html>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlComponent {
  $lang = input('en', { alias: 'lang' });
  $dir = input('ltr', { alias: 'dir' });
  $enableVML = input(true, { alias: 'enableVML' });
}
