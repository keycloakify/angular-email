export const copyTextToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    throw new Error('Not able to copy');
  }
};

export const pxToPt = (px: string): number | null => (isNaN(Number(px)) ? null : (parseInt(px, 10) * 3) / 4);

export interface Margin {
  m?: string;
  mx?: string;
  my?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
}

export const withMargin = (props: Margin) =>
  [
    withSpace(props.m, ['margin']),
    withSpace(props.mx, ['marginLeft', 'marginRight']),
    withSpace(props.my, ['marginTop', 'marginBottom']),
    withSpace(props.mt, ['marginTop']),
    withSpace(props.mr, ['marginRight']),
    withSpace(props.mb, ['marginBottom']),
    withSpace(props.ml, ['marginLeft']),
  ].filter((s) => Object.keys(s).length)[0];

const withSpace = (value: string | undefined, properties: string[]) => {
  return properties.reduce((styles, property) => {
    if (value) {
      return { ...styles, [property]: `${value}px` };
    }
    return styles;
  }, {});
};

// https://stackoverflow.com/a/61410824

export const styleToString = (style: Record<string, string | number | null> | undefined | null) => {
  if (!style) return '';
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() +
      ':' +
      style[key] +
      ';',
    '',
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const classToString = (style: string | string[] | Set<string> | Record<string, any> | null | undefined) => {
  if (!style) return '';
  if (typeof style === 'string') return style;
  if (Array.isArray(style)) return style.join(' ');
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase() +
      ':' +
      style[key as keyof typeof style] +
      ';',
    '',
  );
};

export const unreachable = (
  condition: never,
  message = `Entered unreachable code. Received '${condition}'.`,
): never => {
  throw new TypeError(message);
};

export const HTMLElements = [
  '!DOCTYPE',
  'a',
  'abbr',
  'abbr',
  //"acronym", // NOT HTML5
  'address',
  //"applet", // NOT HTML5 (NOT MAJORLY SUPPORTED)
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  //"basefont", // NOT HTML5
  'bdi',
  'bdo',
  //"big", // NOT HTML5
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  //"center", // NOT HTML5
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  //"dir", NOT HTML5 (use "ul" instead)
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  //"font", // NOT HTML5 (use CSS)
  'footer',
  'form',
  //"frame", // NOT HTML5
  //"frameset", // NOT HTML5
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'meter',
  'nav',
  //"noframes", // NOT HTML5
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  //"strike", NOT HTML5 (Use <del> or <s> instead)
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'svg',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  //"tt", // NOT HTML5 (Use CSS)
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  // xml
  'xml',
  'o:OfficeDocumentSettings',
  'o:AllowPNG',
  'o:PixelsPerInch',
  'angular-email-raw',
];

const START_TAG = '__COMMENT_START';
const END_TAG = '__COMMENT_END';
export function escapeForRawComponent(input: string): string {
  // escape comment sequences
  return input.replace(/<!--/g, START_TAG).replace(/-->/g, END_TAG);
}

export function unescapeForRawComponent(input: string): string {
  return input.replace(new RegExp(START_TAG, 'g'), '<!--').replace(new RegExp(END_TAG, 'g'), '-->');
}
