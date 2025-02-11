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
      <ng-email-preview [preview]="preview" />
      <ng-email-body>
        <ng-email-section styleClass="bg-white">
          <ng-email-container styleClass="mx-auto pt-5 pb-12 w-[580px]">
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
                styleClass="mx-auto mb-4 rounded-full"
              />
            </ng-email-section>
            <ng-email-heading styleClass="text-3xl leading-9 font-bold text-gray-600"
              >Here's what {{ authorName }} wrote</ng-email-heading
            >
            <ng-email-text styleClass="text-lg leading-6 text-gray-600 rounded p-6 bg-gray-100">{{
              reviewText
            }}</ng-email-text>
            <ng-email-text styleClass="text-lg leading-6 text-gray-600">
              Now that the review period is over, we’ve posted
              {{ authorName }}’s review to your Airbnb profile.
            </ng-email-text>
            <ng-email-text styleClass="text-lg leading-6 text-gray-600">
              While it’s too late to write a review of your own, you can send your feedback to {{ authorName }}
              using your Airbnb message thread.
            </ng-email-text>
            <ng-email-section styleClass="pt-4 pb-5">
              <ng-email-button
                styleClass="rounded w-full py-5 block text-center text-non no-underline text-lg text-white bg-pink-600"
                href="https://airbnb.com/"
                [textContent]="'Send My Feedback'"
                >Send My Feedback</ng-email-button
              >
            </ng-email-section>
            <ng-email-hr styleClass="border-gray-300 my-5" />
            <ng-email-text styleClass="text-lg leading-6 text-gray-600 font-bold">Common questions</ng-email-text>
            <ng-email-text>
              <ng-email-link
                href="https://airbnb.com/help/article/13"
                styleClass="text-lg leading-6 text-pink-600 block"
                >How do reviews work?</ng-email-link
              >
            </ng-email-text>
            <ng-email-text>
              <ng-email-link
                href="https://airbnb.com/help/article/1257"
                styleClass="text-lg leading-6 text-pink-600 block"
              >
                How do star ratings work?
              </ng-email-link>
            </ng-email-text>
            <ng-email-text>
              <ng-email-link
                href="https://airbnb.com/help/article/995"
                styleClass="text-lg leading-6 text-pink-600 block"
              >
                Can I leave a review after 14 days?
              </ng-email-link>
            </ng-email-text>
            <ng-email-hr styleClass="border-gray-300 my-5" />
            <ng-email-text styleClass="text-gray-400 text-sm mb-3"
              >Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103</ng-email-text
            >
            <ng-email-link
              href="https://airbnb.com"
              styleClass="underline text-gray-500 text-sm"
              >Report unsafe behavior</ng-email-link
            >
          </ng-email-container>
        </ng-email-section>
      </ng-email-body>
    </ng-email-html>
  `,
  styles: [],
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
