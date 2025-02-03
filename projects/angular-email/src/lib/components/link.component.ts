import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-link',
  template: `
    <a
      [style]="$style()"
      [href]="$href()"
      [target]="$target()"
      ><ng-content></ng-content
    ></a>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $linkStyle = input<Record<string, any> | null | undefined>(null, { alias: 'linkStyle' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $href = input('', { alias: 'href' });
  $target = input('_blank', { alias: 'target' });
  $style = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            color: '#067df7',
            textDecoration: 'none',
          }),
      ...(this.$linkStyle() ?? {}),
    };
  });
}
