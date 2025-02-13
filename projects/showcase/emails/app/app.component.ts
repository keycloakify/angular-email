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
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  authorName = 'Alex';
  baseUrl = 'http://localhost:4200';
  authorImage = `https://svelte-email-rjaapma15-konzeptfabrik.vercel.app/airbnb-review-user.jpeg`;
  reviewText = `“Zeno was a great guest! Easy communication, the apartment was left
  in great condition, very polite, and respectful of all house rules.
  He’s welcome back anytime and would easily recommend him to any
  host!”`;
  previewText = `Read ${this.authorName}'s review`;

  main = {
    backgroundColor: '#ffffff',
  };

  container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
  };

  userImage = {
    margin: '0 auto',
    marginBottom: '16px',
    borderRadius: '50%',
  };

  heading = {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
  };

  paragraph = {
    fontSize: '18px',
    lineHeight: '1.4',
    color: '#484848',
  };

  question = {
    ...this.paragraph,
    fontWeight: '700',
  };

  review = {
    ...this.paragraph,
    padding: '24px',
    backgroundColor: '#f2f3f3',
    borderRadius: '4px',
  };

  button = {
    backgroundColor: '#ff5a5f',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '18px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '19px 0',
  };

  link = {
    ...this.paragraph,
    color: '#ff5a5f',
    display: 'block',
  };

  reportLink = {
    fontSize: '14px',
    color: '#9ca299',
    textDecoration: 'underline',
  };

  hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };

  footer = {
    color: '#9ca299',
    fontSize: '14px',
    marginBottom: '10px',
  };
}

export const renderToHtml = () => {
  return render({ component: AppComponent, selector: 'app-root', props: {}, options: { pretty: true } });
};
