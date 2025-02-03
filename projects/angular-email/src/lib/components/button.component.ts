import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ng-email-button',
  template: `
    @let withBackground = $withBackground();
    @let align = $align();
    @let href = $href();
    @let height = $height();
    @let width = $width();
    @let borderRadius = $borderRadius();

    <table
      [width]="'100%'"
      [border]="0"
      [cellPadding]="0"
      [cellSpacing]="0"
      style="border-collapse: collapse;"
      role="presentation"
    >
      <tr>
        <td [align]="align">
          @if (withBackground) {
            <table
              [align]="align"
              [width]="width"
              [border]="0"
              [cellPadding]="0"
              [cellSpacing]="0"
              role="presentation"
              [style]="{
                border: $borderSize() + 'px solid ' + ($borderColor() ?? 'inherit'),
                borderRadius,
              }"
            >
              <tr>
                <td
                  [attr.bgcolor]="$backgroundColor()"
                  [width]="width"
                  [height]="height"
                  [style]="{
                    borderRadius,
                    height,
                    width,
                    maxWidth: width,
                    textAlign: 'center',
                  }"
                >
                  <a
                    [href]="href"
                    [style]="$withBackgroundStyle()"
                  >
                    <ng-container [ngTemplateOutlet]="content"></ng-container>
                  </a>
                </td>
              </tr>
            </table>
          } @else {
            <noscript [attr.data-html]="$noBgInnerHtmlPre()"></noscript>
            <ng-container [ngTemplateOutlet]="content"></ng-container>
            <noscript [attr.data-html]="$noBgInnerHtmlPost()"></noscript>
            <a
              [href]="href"
              [style]="$withoutBackgroundStyle()"
            >
              <ng-container [ngTemplateOutlet]="content"></ng-container>
            </a>
          }
        </td>
      </tr>
    </table>

    <ng-template #content><ng-content></ng-content></ng-template>
  `,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $buttonStyle = input<Record<string, any> | null | undefined>(null, { alias: 'buttonStyle' });

  $href = input<string>(undefined, { alias: 'href' });
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
    ...(this.$buttonStyle() ?? {}),
    ...(this.$withBackground() ? {} : { msoHide: 'all' }),
  }));

  $withoutBackgroundStyle = computed(() => ({
    ...this.$baseStyle(),
    // background styles
    ...this.$propStyles(),
    ...(this.$buttonStyle() ?? {}),
    ...(this.$withBackground() ? {} : { msoHide: 'all' }),
  }));

  $noBgInnerHtmlPre = computed(
    () => `<!--[if mso]>
            <v:roundrect href="${this.$href()}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:${this.$height()}px;v-text-anchor:middle;width:${this.$width()}px;" arcsize="${this.$arcsize()}%" ${
              this.$borderColor() ? `strokecolor=${this.$borderColor()}` : ''
            } ${this.$borderSize() ? `strokeweight="${this.$borderSize()}px"` : `stroke="false"`} ${
              this.$backgroundColor() ? `fillcolor=${this.$backgroundColor()}` : `fill="false"`
            }>
            <w:anchorlock/>
            <center style="font-size:${this.$fontSize()}px;${this.$textColor() ? `color:${this.$textColor()};` : ''}">`,
  );
  $noBgInnerHtmlPost = computed(
    () => `</center></v:roundrect>
            <![endif]-->`,
  );
}
