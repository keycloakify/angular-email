import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-hr',
  templateUrl: 'hr.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $hrStyle = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            width: '100%',
            border: 'none',
            borderTop: '1px solid #eaeaea',
          }),
      ...(this.$style() ?? {}),
    };
  });
}
