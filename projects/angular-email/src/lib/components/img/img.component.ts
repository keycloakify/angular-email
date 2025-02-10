import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-img',
  templateUrl: 'img.component.html',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | undefined>(undefined, { alias: 'styleClass' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $alt = input('', { alias: 'alt' });
  $src = input('', { alias: 'src' });
  $width = input('0', { alias: 'width' });
  $height = input('0', { alias: 'height' });
  $imageStyle = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            display: 'block',
            outline: 'none',
            border: 'none',
            textDecoration: 'none',
          }),
      ...(this.$style() ?? {}),
    };
  });
}
