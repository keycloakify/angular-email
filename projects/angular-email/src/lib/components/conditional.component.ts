import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, input } from '@angular/core';

@Component({
  selector: 'ng-email-conditional',
  template: `
    @let mso = $mso();

    @if (!mso) {
      <noscript [attr.data-html]="noMsoInnerHtmlPre"></noscript>
      <ng-container [ngTemplateOutlet]="content"></ng-container>
      <noscript [attr.data-html]="noMsoInnerHtmlPost"></noscript>
    } @else {
      <noscript [attr.data-html]="$msoInnerHtmlPre()"></noscript>
      <ng-container [ngTemplateOutlet]="content"></ng-container>
      <noscript [attr.data-html]="msoInnerHtmlPost"></noscript>
    }
    <ng-template #content><ng-content></ng-content></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConditionalComponent {
  $expression = input(undefined, { alias: 'expression' });
  $mso = input<boolean>(undefined, { alias: 'mso' });

  noMsoInnerHtmlPre = '&lt;!--[if !mso]&gt;&lt;!--&gt;';
  noMsoInnerHtmlPost = '&lt;!--&lt;![endif]--&gt;';

  $msoInnerHtmlPre = computed(() => `&lt;!--[if ${this.$expression() ?? 'mso'}]&gt;`);
  msoInnerHtmlPost = '&lt;![endif]--&gt;';

  constructor() {
    effect(() => {
      if (typeof this.$expression() === 'undefined' && typeof this.$mso() === 'undefined')
        throw new RangeError('angular-email: Conditional expects the `expression` or `mso` prop to be defined');

      if (typeof this.$expression() !== 'undefined' && typeof this.$mso() !== 'undefined')
        throw new RangeError(
          'angular-email: Conditional expects the `expression` or `mso` prop to be defined, not both',
        );
    });
  }
}
