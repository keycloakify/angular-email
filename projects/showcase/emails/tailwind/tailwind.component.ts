import { Component, input, ViewEncapsulation } from '@angular/core';
import {
  BodyComponent,
  ButtonComponent,
  ColorSchemeComponent,
  ContainerComponent,
  HeadComponent,
  HeadingComponent,
  HrComponent,
  HtmlComponent,
  ImgComponent,
  LinkComponent,
  PreviewComponent,
  render,
  RenderToHtml,
  SectionComponent,
  TextComponent,
} from '@keycloakify/angular-email';

@Component({
  selector: 'app-root',
  imports: [
    BodyComponent,
    ButtonComponent,
    HtmlComponent,
    HeadComponent,
    PreviewComponent,
    SectionComponent,
    ContainerComponent,
    HeadingComponent,
    HrComponent,
    ImgComponent,
    LinkComponent,
    TextComponent,
    ColorSchemeComponent,
  ],
  templateUrl: 'tailwind.component.html',
  styleUrls: ['../../styles.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TailwindComponent {
  preview = input(`Read Alex's review`);

  authorName = 'Alex';
  baseUrl = 'http://localhost:4200';
  authorImage = `https://svelte-email-rjaapma15-konzeptfabrik.vercel.app/airbnb-review-user.jpeg`;
  reviewText = `“Zeno was a great guest! Easy communication, the apartment was left
  in great condition, very polite, and respectful of all house rules.
  He’s welcome back anytime and would easily recommend him to any
  host!”`;
}

export type TailwindComponentProps = { preview: string };

export const renderToHtml: RenderToHtml<TailwindComponentProps> = (props) => {
  return render({
    component: TailwindComponent,
    selector: 'app-root',
    props,
    options: {
      pretty: true,
      withTailwind: true,
    },
  });
};
