import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-background',
  template: `
    @let width = $width();
    @let height = $height();

    <table
      [cellPadding]="0"
      [cellSpacing]="0"
      [border]="0"
      width="100%"
      [attr.height]="height"
      role="presentation"
    >
      <tr>
        <td
          [align]="'top'"
          [width]="width"
          [height]="height && width ? height : undefined"
          [attr.bgcolor]="$bgColor()"
          [attr.background]="$src()"
          [style]="$style()"
        >
          <ng-content />
        </td>
      </tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class BackgroundComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $backgroundStyle = input<Record<string, any> | null | undefined>(null, { alias: 'columnStyle' });

  $width = input<number>(0, { alias: 'width' });
  $height = input<number>(0, { alias: 'height' });
  $src = input<string>(undefined, { alias: 'src' });
  $bgRepeat = input<'repeat' | 'no-repeat'>('no-repeat', { alias: 'bgRepeat' });
  $bgColor = input<string>(undefined, { alias: 'bgColor' });

  $style = computed(() => ({ backgroundRepeat: this.$bgRepeat(), ...(this.$backgroundStyle() ?? {}) }));
}
