import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-link',
  templateUrl: 'link.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $href = input('', { alias: 'href' });
  $target = input('_blank', { alias: 'target' });
  $linkStyle = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            color: '#067df7',
            textDecoration: 'none',
          }),
      ...(this.$style() ?? {}),
    };
  });
}
