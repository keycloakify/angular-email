import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ng-email-html',
  templateUrl: 'html.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlComponent {
  $lang = input('en', { alias: 'lang' });
  $dir = input('ltr', { alias: 'dir' });
  $enableVML = input(true, { alias: 'enableVML' });
}
