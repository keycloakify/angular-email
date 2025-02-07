import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-background',
  templateUrl: 'background.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class BackgroundComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $backgroundStyle = input<Record<string, any> | null | undefined>(null, { alias: 'backgroundStyle' });

  $width = input<number>(0, { alias: 'width' });
  $height = input<number>(0, { alias: 'height' });
  $src = input<string>(undefined, { alias: 'src' });
  $bgRepeat = input<'repeat' | 'no-repeat'>('no-repeat', { alias: 'bgRepeat' });
  $bgColor = input<string>(undefined, { alias: 'bgColor' });

  $style = computed(() => ({ backgroundRepeat: this.$bgRepeat(), ...(this.$backgroundStyle() ?? {}) }));
}
