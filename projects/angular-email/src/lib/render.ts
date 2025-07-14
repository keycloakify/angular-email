import { renderApplication } from '@angular/platform-server';
import { provideServerRendering } from '@angular/ssr';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import * as cheerio from 'cheerio/slim';
import { convert } from 'html-to-text';
import juice from 'juice';
import prettyPrint from 'pretty';
import { Config } from 'tailwindcss-v3';
import { HTMLElements, unescapeForRawComponent } from './utils';

type Render<Input extends Record<string, any>> = {
  component: Type<unknown>;
  /** Component selector */
  selector: string;
  props?: Input;
  options?: {
    plainText?: boolean;
    pretty?: boolean;
    /** tailwind configuration object */
    tailwindConfig?: Partial<Config>;
    signalInputsPrefix?: string;
  };
};

/**
 * Renders an Angular component to HTML and applies transformations.
 *
 * @param component - The Angular component to render.
 * @param selector - The Component selector.
 * @param options - Optional rendering options.
 *
 * @returns {Promise<string>} The rendered HTML or plain text.
 */
export const render = async <Input extends Record<string, any>>({
  component,
  selector,
  props,
  options,
}: Render<Input>) => {
  console.log = (
    (log) =>
    (...args) => {
      if (args[0] !== 'Angular is running in development mode.') log(...args);
    }
  )(console.log);
  const { style, html: normalizedHtml } = await renderNgComponent(
    component,
    selector,
    props,
    options?.signalInputsPrefix,
  );
  const html = applyHtmlTransformations(normalizedHtml);

  if (options?.plainText) {
    return renderAsPlainText(html);
  }
  const tailwindConfig = options?.tailwindConfig;
  const css = await parseStyles(html, style, tailwindConfig);
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const markup = await inlineCss(html, css, !!options?.pretty);
  const document = `${doctype}${markup}`;
  return document;
};

export type RenderToHtml<Input extends Record<string, any>> = (props?: Input) => ReturnType<typeof render>;

/**
 * Converts the given markup string to plain text while skipping certain elements.
 *
 * @param markup - The HTML markup string to be converted to plain text.
 * @returns The plain text representation of the given markup.
 *
 * The conversion skips the following elements:
 * - `<img>` tags
 * - Elements with the ID `__angular-email-preview`
 */
const renderAsPlainText = (markup: string) => {
  return convert(markup, {
    decodeEntities: true,
    formatters: {
      raw: (elem, _walk, builder) => {
        if (elem.children.length && elem.children[0].type === 'comment') {
          builder.addInline(unescapeForRawComponent(elem.children[0].data!.trim()));
        }
      },
    },
    selectors: [
      { selector: '[data-skip="true"]', format: 'skip' },
      { selector: 'img', format: 'skip' },
      { selector: '#__angular-email-preview', format: 'skip' },
      {
        format: 'raw',
        options: {},
        selector: 'angular-email-raw',
      },
    ],
  });
};

/**
 * Renders an Angular component to html.
 *
 * @param component - The Angular component to render.
 * @param selector - The CSS selector for the component.
 * @returns A promise that resolves to the rendered HTML string.
 */
const renderNgComponent = async (
  component: Type<unknown>,
  selector: string,
  props?: Record<string, any>,
  signalInputsPrefix?: string,
) => {
  const bootstrap = async () => {
    const appRef = await bootstrapApplication(component, {
      providers: [provideZonelessChangeDetection(), provideServerRendering()],
    });
    appRef.components.forEach((componentRef) => {
      Object.entries(props ?? {}).forEach(([key, value]) => {
        if (key in componentRef.instance || `${signalInputsPrefix ?? ''}${key}` in componentRef.instance) {
          componentRef.setInput(key, value);
        }
      });
      componentRef.changeDetectorRef.detectChanges();
    });
    return appRef;
  };
  const ngHtml = await renderApplication(bootstrap, {
    document: `<${selector}></${selector}>`,
  });
  const $ = cheerio.load(ngHtml, {
    xml: { lowerCaseAttributeNames: false, lowerCaseTags: false },
  });
  let style: string = '';
  $('style').each(function () {
    const content = $(this).html();
    if (content) {
      style += `\n${content}`;
    }
  });
  const html = normalizeNgHtml(ngHtml, selector);
  return { style, html };
};

/**
 * Normalizes the provided HTML string by extracting the content within the specified selector
 * and removing any non-standard HTML elements.
 *
 * @param html - The HTML string to be normalized.
 * @param selector - The CSS selector used to identify the content to be extracted.
 * @returns The normalized HTML string with the content of the specified selector and without non-standard HTML elements.
 */
const normalizeNgHtml = (html: string, selector: string): string => {
  const nsHtmlRegex = new RegExp(`<(?!(\\/?(${HTMLElements.join('|')})(?![-\\w])))[^>]+>`, 'gm');
  return html
    .replace(new RegExp(`[\\s\\S]*?<${selector}[\\s\\S]*?>([\\s\\S]*?)<\\/${selector}>[\\s\\S]*?`, 'gm'), '$1')
    .replace(nsHtmlRegex, '');
};

/**
 * Applies HTML transformations to the provided HTML string.
 *
 * This function uses Cheerio to load the HTML and perform transformations such as
 * replacing placeholders and applying styles from the provided CSS file paths.
 * It also ensures that certain HTML entities are replaced with their corresponding
 * characters.
 *
 * @param html - The HTML string to transform.
 * @param cssFilePaths - An optional array of CSS file paths to apply styles from.
 * @returns The transformed HTML string.
 */
const applyHtmlTransformations = (html: string) => {
  const $ = cheerio.load(html, {
    xml: { lowerCaseAttributeNames: false, lowerCaseTags: false },
  });
  replacePlaceholders($);

  return $.html()
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#x24;', '$');
};

/**
 * Replaces elements with the `data-html` attribute with their corresponding HTML content.
 *
 * This function iterates over all elements that have the `data-html` attribute,
 * retrieves the value of the attribute, and replaces the element with the HTML content
 * specified in the attribute.
 *
 * @param $ - The Cheerio API instance used to manipulate the HTML.
 */
const replacePlaceholders = ($: cheerio.CheerioAPI) => {
  $('[data-html]').each(function () {
    const content = $(this).attr('data-html');
    if (content) {
      $(this).replaceWith(`${content}`);
    }
  });
};

/**
 * Applies the styles from the specified CSS file paths to the HTML document.
 *
 * @param html - The HTML string to process.
 * @param style - The raw content of <style> tags
 * @param tailwindConfig - Optional Tailwind CSS configuration to use. If not provided, the `tailwindcss-preset-email` preset will be used.
 *
 */
const parseStyles = async (html: string, style: string, tailwindConfig?: Partial<Config>) => {
  const { tailwindcssPresetEmail } = await import('@keycloakify/angular-email/tailwindcss-preset-email');
  const { default: postcss } = await import('postcss');
  const { default: tailwindcss } = await import('tailwindcss-v3');

  const result = await postcss(
    tailwindcss({
      presets: tailwindConfig ? [tailwindConfig] : [tailwindcssPresetEmail],
      content: [
        {
          raw: html,
          extension: 'html',
        },
      ],
    }),
  ).process(style, { map: false, from: undefined });
  return result.css;
};

/**
 * Inlines CSS into the provided HTML string using Maizzle and Tailwind CSS.
 *
 * @param html - The HTML string to process.
 * @param css - The CSS to inline.
 * @param pretty - Whether to prettify the output HTML. Defaults to `false`.
 * @returns A promise that resolves to the processed HTML string with inlined CSS.
 */

const inlineCss = async (html: string, css: string, pretty: boolean = false) => {
  juice.styleToAttribute = {};
  juice.excludedProperties.push(...[]);
  juice.widthElements = ['img', 'video'].map((i) => i.toUpperCase() as unknown as HTMLElement);
  juice.heightElements = ['img', 'video'].map((i) => i.toUpperCase() as unknown as HTMLElement);

  const inlined = unescapeForRawComponent(
    juice
      .inlineContent(html, css, {
        applyWidthAttributes: true,
        applyHeightAttributes: true,
        removeStyleTags: false,
      })
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replaceAll('&#x24;', '$')
      .replace(/<angular-email-raw[\s\S]*?><!--(.*?)--><\/angular-email-raw>/gm, `$1`),
  );
  if (pretty) return prettyPrint(inlined);
  return inlined;
};
