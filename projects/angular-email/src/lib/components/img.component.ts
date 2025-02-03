import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-img',
  template: `
    <img
      [style]="$style()"
      [alt]="$alt()"
      [src]="$src()"
      [width]="$width()"
      [height]="$height()"
    />
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $imgStyle = input<Record<string, any> | null | undefined>(null, { alias: 'imgStyle' });
  $disableDefaultStyle = input<boolean>(false, { alias: 'disableDefaultStyle' });
  $alt = input('', { alias: 'alt' });
  $src = input('', { alias: 'src' });
  $width = input('0', { alias: 'width' });
  $height = input('0', { alias: 'height' });
  $style = computed(() => {
    return {
      ...(this.$disableDefaultStyle()
        ? {}
        : {
            display: 'block',
            outline: 'none',
            border: 'none',
            textDecoration: 'none',
          }),
      ...(this.$imgStyle() ?? {}),
    };
  });
}
