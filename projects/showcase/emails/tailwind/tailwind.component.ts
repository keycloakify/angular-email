import { Component, ViewEncapsulation } from '@angular/core';
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
  SectionComponent,
  TextComponent,
} from '@keycloakify/angular-email';
import tailwindConfig from '../../tailwind.config';

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
  preview = `Read Alex's review`;

  authorName = 'Alex';
  baseUrl = 'http://localhost:4200';
  authorImage = `https://svelte-email-rjaapma15-konzeptfabrik.vercel.app/airbnb-review-user.jpeg`;
  reviewText = `“Zeno was a great guest! Easy communication, the apartment was left
  in great condition, very polite, and respectful of all house rules.
  He’s welcome back anytime and would easily recommend him to any
  host!”`;
}
export const renderToHtml = () => {
  return render({
    component: TailwindComponent,
    selector: 'app-root',
    props: {},
    options: {
      pretty: true,
      tailwindConfig,
    },
  });
};
