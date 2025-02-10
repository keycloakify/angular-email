import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-button',
  templateUrl: 'button.component.html',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $style = input<Record<string, any> | null | undefined>(null, { alias: 'style' });
  $styleClass = input<string | null>(null, { alias: 'styleClass' });

  $href = input<string>(undefined, { alias: 'href' });
  $textContent = input.required<string>({ alias: 'textContent' });
  $width = input<number>(undefined, { alias: 'width' });
  $height = input<number>(undefined, { alias: 'height' });
  $borderRadius = input(0, { alias: 'borderRadius' });
  $textColor = input<string>(undefined, { alias: 'textColor' });
  $backgroundColor = input<string>(undefined, { alias: 'backgroundColor' });
  $borderColor = input<string>(undefined, { alias: 'borderColor' });
  $borderSize = input(1, { alias: 'borderSize' });
  $fontSize = input(16, { alias: 'fontSize' });
  $align = input<string>('left', { alias: 'align' });
  $withBackground = input(false, { alias: 'withBackground' });

  $arcsize = computed(() => Math.floor((this.$borderRadius() / (this.$height() ?? 1)) * 100));
  $lineHeight = computed(() =>
    this.$borderSize() ? (this.$height() ?? 0) - 2 * this.$borderSize() : (this.$height() ?? 0),
  );

  private $baseStyle = computed(() => ({
    '-webkit-text-size-adjust': 'none',
    borderRadius: this.$borderRadius(),
    display: 'inline-block',
    fontSize: this.$fontSize(),
    lineHeight: `${this.$lineHeight()}px`,
    maxWidth: this.$width(),
    textAlign: 'center',
    textDecoration: 'none',
    width: '100%',
  }));

  private $borderStyles = computed(() => ({
    border: `${this.$borderSize()}px solid ${this.$borderColor()}`,
    msoBorderAlt: 'none',
  }));

  private $propStyles = computed(() => ({
    // border styles
    ...(this.$borderColor() ? this.$borderStyles() : {}),
    // background styles
    ...(this.$backgroundColor() ? { backgroundColor: this.$backgroundColor() } : {}),
    // text styles
    ...(this.$textColor() ? { color: this.$textColor() } : {}),
  }));

  $withBackgroundStyle = computed(() => ({
    ...this.$baseStyle(),
    // background styles
    ...(this.$backgroundColor() ? { backgroundColor: this.$backgroundColor() } : {}),
    // text styles
    ...(this.$textColor() ? { color: this.$textColor() } : {}),
    ...(this.$style() ?? {}),
    ...(this.$withBackground() ? {} : { msoHide: 'all' }),
  }));

  $withoutBackgroundStyle = computed(() => ({
    ...this.$baseStyle(),
    // background styles
    ...this.$propStyles(),
    ...(this.$style() ?? {}),
    ...(this.$withBackground() ? {} : { msoHide: 'all' }),
  }));

  $noBgInnerHtml = computed(() => {
    const href = this.$href();
    const borderColor = this.$borderColor();
    const borderSize = this.$borderSize();
    const height = this.$height();
    const width = this.$width();
    const arcsize = this.$arcsize();
    const backgroundColor = this.$backgroundColor();
    const fontSize = this.$fontSize();
    const textColor = this.$textColor();
    const textContent = this.$textContent();
    return `<!--[if mso]>
            <v:roundrect href="${href}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="${height !== undefined ? `height:${height}px` : ''};v-text-anchor:middle;${width !== undefined ? `height:${width}px` : ''};" arcsize="${arcsize}%" ${
              borderColor ? `strokecolor=${borderColor}` : ''
            } ${borderSize ? `strokeweight="${borderSize}px"` : `stroke="false"`} ${
              backgroundColor ? `fillcolor=${backgroundColor}` : `fill="false"`
            }>
            <w:anchorlock/>
            <center style="font-size:${fontSize}px;${textColor ? `color:${textColor};` : ''}">
            ${textContent}
            </center></v:roundrect>
            <![endif]-->`;
  });
}
