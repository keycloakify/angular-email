/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideExperimentalZonelessChangeDetection, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { render as maizzleRender } from '@maizzle/framework';
import * as cheerio from 'cheerio';
import { convert } from 'html-to-text';
import { readFileSync } from 'node:fs';
import { Config } from 'tailwindcss';
import { HTMLElements } from './utils';

type Render = {
  component: Type<unknown>;
  /** Component selector */
  selector: string;
  props?: Record<string, any>;
  options?: {
    plainText?: boolean;
    pretty?: boolean;
    cssFilePaths?: string[];
    /** path or configuration object */
    tailwindConfig?: string | Partial<Config>;
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
export const render = async ({ component, selector, props, options }: Render) => {
  const normalizedHtml = await renderNgComponent(component, selector, props, options?.signalInputsPrefix);
  const html = applyHtmlTransformations(normalizedHtml, options?.cssFilePaths);
  if (options?.plainText) {
    return renderAsPlainText(html);
  }
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const tailwindConfig = await getTailwindConfig(options?.tailwindConfig);
  const markup = await inlineCss(html, !!options?.pretty, tailwindConfig);
  const document = `${doctype}${markup}`;
  return document;
};

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
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: '#__angular-email-preview', format: 'skip' },
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
      providers: [provideExperimentalZonelessChangeDetection(), provideServerRendering()],
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
  return normalizeNgHtml(ngHtml, selector);
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
  const nsHtmlRegex = new RegExp(`<(?!(\\/?(${HTMLElements.join('|')})))[^>]+>`, 'gm');
  return html
    .replace(new RegExp(`.+<${selector}[\\s\\S]*?>([\\s\\S]*?)<\\/${selector}>.+`, 'gm'), '$1')
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
const applyHtmlTransformations = (html: string, cssFilePaths?: string[]) => {
  const $ = cheerio.load(html, { xml: { lowerCaseAttributeNames: false, lowerCaseTags: false } });
  replacePlaceholders($);
  applyStyles($, cssFilePaths ?? []);
  return $.html()
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;nbsp;', '&nbsp;')
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
      $(this).replaceWith(`${content}\n`);
    }
  });
};

/**
 * Applies the styles from the specified CSS file paths to the HTML document.
 *
 * @param $ - The Cheerio API instance used to manipulate the HTML document.
 * @param cssFilePaths - An array of file paths to the CSS files to be applied.
 */
const applyStyles = ($: cheerio.CheerioAPI, cssFilePaths: string[]) => {
  (cssFilePaths ?? []).forEach((path) => {
    const styleContent = readFileSync(path, { encoding: 'utf-8' });
    $('head').append(`<style>${styleContent}</style>`);
  });
};

/**
 * Inlines CSS into the provided HTML string using Maizzle and Tailwind CSS.
 *
 * @param html - The HTML string to process.
 * @param pretty - Whether to prettify the output HTML. Defaults to `false`.
 * @param tailwindConfig - Optional Tailwind CSS configuration to use. If not provided, the `tailwindcss-preset-email` preset will be used.
 * @returns A promise that resolves to the processed HTML string with inlined CSS.
 */
const inlineCss = async (html: string, pretty: boolean = false, tailwindConfig?: Partial<Config>) => {
  //@ts-expect-error: missing exports
  const tailwindcssPresetEmail = (await import('tailwindcss-preset-email')).default;
  return (
    await maizzleRender(html, {
      css: {
        shorthand: true,
        inline: {
          applyWidthAttributes: true,
          applyHeightAttributes: true,
        },
        purge: {
          removeHTMLComments: false,
        },
        tailwind: {
          presets: tailwindConfig ? [tailwindConfig] : [tailwindcssPresetEmail],
          content: [
            {
              raw: html,
              extension: 'html',
            },
          ],
        },
      },
      prettify: pretty,
      minify: !pretty,
    })
  ).html;
};

/**
 * Asynchronously retrieves the Tailwind CSS configuration.
 *
 * @param tailwindConfig - The path to the Tailwind CSS configuration file or a partial configuration object.
 * @returns A promise that resolves to a partial Tailwind CSS configuration object, or `undefined` if no configuration is provided.
 */
const getTailwindConfig = async (tailwindConfig?: string | Partial<Config>) => {
  let config: Partial<Config> | undefined;
  if (tailwindConfig) {
    if (typeof tailwindConfig === 'string') {
      config = (await import(tailwindConfig)).default;
    } else {
      config = tailwindConfig;
    }
  }
  return config;
};
