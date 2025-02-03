import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-hr',
  template: `<hr [style]="$style()" />`,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $hrStyle = input<Record<string, any> | null | undefined>(null, { alias: 'hrStyle' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $style = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            width: '100%',
            border: 'none',
            borderTop: '1px solid #eaeaea',
          }),
      ...(this.$hrStyle() ?? {}),
    };
  });
}
