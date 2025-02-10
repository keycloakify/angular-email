import { Component } from '@angular/core';
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
  template: `
    <ng-email-html>
      <ng-email-head>
        <ng-email-color-scheme></ng-email-color-scheme>
      </ng-email-head>
      <ng-email-preview [preview]="previewText" />
      <ng-email-body>
        <ng-email-section [style]="main">
          <ng-email-container [style]="container">
            <ng-email-img
              [src]="'https://svelte-email-rjaapma15-konzeptfabrik.vercel.app/airbnb-logo.png'"
              width="96"
              height="30"
              alt="Airbnb"
            />
            <ng-email-section>
              <ng-email-img
                [src]="authorImage"
                width="96"
                height="96"
                [alt]="authorName"
                [style]="userImage"
              />
            </ng-email-section>
            <ng-email-heading [style]="heading">Here's what {{ authorName }} wrote</ng-email-heading>
            <ng-email-text [style]="review">{{ reviewText }}</ng-email-text>
            <ng-email-text [style]="paragraph">
              Now that the review period is over, we’ve posted
              {{ authorName }}’s review to your Airbnb profile.
            </ng-email-text>
            <ng-email-text [style]="paragraph">
              While it’s too late to write a review of your own, you can send your feedback to {{ authorName }}
              using your Airbnb message thread.
            </ng-email-text>
            <ng-email-section [style]="{ padding: '16px 0 20px' }">
              <ng-email-button
                [style]="button"
                styleClass="mt-1"
                href="https://airbnb.com/"
                [textContent]="'Send My Feedback'"
                >Send My Feedback</ng-email-button
              >
            </ng-email-section>
            <ng-email-hr [style]="hr" />
            <ng-email-text [style]="question">Common questions</ng-email-text>
            <ng-email-text>
              <ng-email-link
                href="https://airbnb.com/help/article/13"
                [style]="link"
                >How do reviews work?</ng-email-link
              >
            </ng-email-text>
            <ng-email-text>
              <ng-email-link
                href="https://airbnb.com/help/article/1257"
                [style]="link"
              >
                How do star ratings work?
              </ng-email-link>
            </ng-email-text>
            <ng-email-text>
              <ng-email-link
                href="https://airbnb.com/help/article/995"
                [style]="link"
              >
                Can I leave a review after 14 days?
              </ng-email-link>
            </ng-email-text>
            <ng-email-hr [style]="hr" />
            <ng-email-text [style]="footer">Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103</ng-email-text>
            <ng-email-link
              href="https://airbnb.com"
              [style]="reportLink"
              >Report unsafe behavior</ng-email-link
            >
          </ng-email-container>
        </ng-email-section>
      </ng-email-body>
    </ng-email-html>
  `,
  styles: [],
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
  fontFamily =
    '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif';

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
    fontFamily: this.fontFamily,
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
  };

  paragraph = {
    fontFamily: this.fontFamily,
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
    fontFamily: this.fontFamily,
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
    fontFamily: this.fontFamily,
    fontSize: '14px',
    color: '#9ca299',
    textDecoration: 'underline',
  };

  hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };

  footer = {
    fontFamily: this.fontFamily,
    color: '#9ca299',
    fontSize: '14px',
    marginBottom: '10px',
  };
}
