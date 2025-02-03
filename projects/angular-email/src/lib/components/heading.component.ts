import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { styleToString, withMargin } from '../utils';

@Component({
  selector: 'ng-email-heading',
  template: `
    @let heading = $as();
    @let style = $style();
    @if (heading === 'h1') {
      <h1 [style]="style">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </h1>
    } @else if (heading === 'h2') {
      <h2 [style]="style">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </h2>
    } @else if (heading === 'h3') {
      <h3 [style]="style">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </h3>
    } @else if (heading === 'h4') {
      <h4 [style]="style">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </h4>
    } @else if (heading === 'h5') {
      <h5 [style]="style">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </h5>
    } @else if (heading === 'h6') {
      <h6 [style]="style">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </h6>
    } @else {
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    }
    <ng-template #content><ng-content></ng-content></ng-template>
  `,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $headingStyle = input<Record<string, any> | null | undefined>(null, { alias: 'headingStyle' });
  $as = input<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>('h1', { alias: 'as' });
  $m = input<string>(undefined, { alias: 'm' });
  $mx = input<string>(undefined, { alias: 'mx' });
  $my = input<string>(undefined, { alias: 'my' });
  $mt = input<string>(undefined, { alias: 'mt' });
  $mr = input<string>(undefined, { alias: 'mr' });
  $mb = input<string>(undefined, { alias: 'mb' });
  $ml = input<string>(undefined, { alias: 'ml' });
  $style = computed(() => {
    return styleToString({
      ...withMargin({
        m: this.$m(),
        mx: this.$mx(),
        my: this.$my(),
        mt: this.$mt(),
        mr: this.$mr(),
        mb: this.$mb(),
        ml: this.$ml(),
      }),
      ...(this.$headingStyle() ?? {}),
    });
  });
}
