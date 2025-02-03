import { provideExperimentalZonelessChangeDetection, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import * as cheerio from 'cheerio';
import { convert } from 'html-to-text';
import pretty from 'pretty';
import { HTMLElements } from './utils';

type Render = {
  component: Type<unknown>;
  /** Component selector */
  selector: string;
  options?: {
    plainText?: boolean;
    pretty?: boolean;
  };
};

export const render = async ({ component, selector, options }: Render) => {
  const nsHtmlRegex = new RegExp(`<(?!(\\/?(${HTMLElements.join('|')})))[^>]+>`, 'gm');
  const bootstrap = () =>
    bootstrapApplication(component, {
      providers: [provideExperimentalZonelessChangeDetection(), provideServerRendering()],
    });
  const ngHtml = await renderApplication(bootstrap, {
    document: `<${selector}></${selector}>`,
  });
  const normalizedHtml = ngHtml
    .replace(new RegExp(`.+<${selector}[\\s\\S]*?>([\\s\\S]*?)<\\/${selector}>.+`, 'gm'), '$1')
    .replace(nsHtmlRegex, '');
  const $ = cheerio.load(normalizedHtml);
  $('[data-html]').each(function () {
    const content = $(this).attr('data-html');
    if (content) {
      $(this).replaceWith(`${content}\n`);
    }
  });
  const html = $.html().replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  if (options?.plainText) {
    return renderAsPlainText(html);
  }
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = html;
  const document = `${doctype}${markup}`;
  if (options?.pretty) {
    return pretty(document);
  }
  return document;
};

const renderAsPlainText = (markup: string) => {
  return convert(markup, {
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: '#__angular-email-preview', format: 'skip' },
    ],
  });
};
