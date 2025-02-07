import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { styleToString, withMargin } from '../../utils';

@Component({
  selector: 'ng-email-heading',
  templateUrl: 'heading.component.html',
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
