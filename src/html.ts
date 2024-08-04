/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { HTMLOptions, AllFormatOptions, mergeOpts } from './opts';
import { OptionNamePart, Paragraph, ReturnValuePart } from './dom';
import { addToDestination } from './format';

export function quoteHTML(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function quoteHTMLArg(text: string): string {
  return quoteHTML(text).replace(/"/g, '&quot;');
}

function formatOptionLikePlain(
  part: OptionNamePart | ReturnValuePart,
  url: string | undefined,
  what: 'option' | 'retval',
): string {
  let link_start = '';
  let link_end = '';
  if (url) {
    link_start = `<a href="${quoteHTMLArg(encodeURI(url))}">`;
    link_end = '</a>';
  }
  let strong_start = '';
  let strong_end = '';
  if (what === 'option' && part.value === undefined) {
    strong_start = '<strong>';
    strong_end = '</strong>';
  }
  const text = part.value === undefined ? part.name : `${part.name}=${part.value}`;
  return `<code>${strong_start}${link_start}${quoteHTML(text)}${link_end}${strong_end}</code>`;
}

const PLAIN_FORMATTER: AllFormatOptions = {
  formatError: (part) => `<span class="error">ERROR while parsing: ${quoteHTML(part.message)}</span>`,
  formatBold: (part) => `<b>${quoteHTML(part.text)}</b>`,
  formatCode: (part) => `<code>${quoteHTML(part.text)}</code>`,
  formatHorizontalLine: () => '<hr>',
  formatItalic: (part) => `<em>${quoteHTML(part.text)}</em>`,
  formatLink: (part) => `<a href='${quoteHTMLArg(encodeURI(part.url))}'>${quoteHTML(part.text)}</a>`,
  formatModule: (part, url) =>
    url
      ? `<a href='${quoteHTMLArg(encodeURI(url))}'>${quoteHTML(part.fqcn)}</a>`
      : `<span>${quoteHTML(part.fqcn)}</span>`,
  formatRSTRef: (part) => `<span>${quoteHTML(part.text)}</span>`,
  formatURL: (part) => `<a href='${quoteHTMLArg(encodeURI(part.url))}'>${quoteHTML(part.url)}</a>`,
  formatText: (part) => quoteHTML(part.text),
  formatEnvVariable: (part) => `<code>${quoteHTML(part.name)}</code>`,
  formatOptionName: (part, url) => formatOptionLikePlain(part, url, 'option'),
  formatOptionValue: (part) => `<code>${quoteHTML(part.value)}</code>`,
  formatPlugin: (part, url) =>
    url
      ? `<a href='${quoteHTMLArg(encodeURI(url))}'>${quoteHTML(part.plugin.fqcn)}</a>`
      : `<span>${quoteHTML(part.plugin.fqcn)}</span>`,
  formatReturnValue: (part, url) => formatOptionLikePlain(part, url, 'retval'),
};

function formatOptionLikeAntsibullDocs(
  part: OptionNamePart | ReturnValuePart,
  url: string | undefined,
  what: 'option' | 'retval',
): string {
  let link_start = '';
  let link_end = '';
  if (url) {
    link_start = `<a class="reference internal" href="${quoteHTMLArg(
      encodeURI(url),
    )}"><span class="std std-ref"><span class="pre">`;
    link_end = '</span></span></a>';
  }
  let cls: string;
  let strong_start = '';
  let strong_end = '';
  if (what === 'option') {
    if (part.value === undefined) {
      cls = 'ansible-option';
      strong_start = '<strong>';
      strong_end = '</strong>';
    } else {
      cls = 'ansible-option-value';
    }
  } else {
    cls = 'ansible-return-value';
  }
  let text: string;
  if (part.value === undefined) {
    text = part.name;
  } else {
    text = `${part.name}=${part.value}`;
  }
  return `<code class="${cls} literal notranslate">${strong_start}${link_start}${quoteHTML(
    text,
  )}${link_end}${strong_end}</code>`;
}

const ANTSIBULL_DOCS_FORMATTER: AllFormatOptions = {
  formatError: (part) => `<span class="error">ERROR while parsing: ${quoteHTML(part.message)}</span>`,
  formatBold: (part) => `<b>${quoteHTML(part.text)}</b>`,
  formatCode: (part) => `<code class='docutils literal notranslate'>${quoteHTML(part.text)}</code>`,
  formatHorizontalLine: () => '<hr/>',
  formatItalic: (part) => `<em>${quoteHTML(part.text)}</em>`,
  formatLink: (part) => `<a href='${quoteHTMLArg(encodeURI(part.url))}'>${quoteHTML(part.text)}</a>`,
  formatModule: (part, url) =>
    url
      ? `<a href='${quoteHTMLArg(encodeURI(url))}' class='module'>${quoteHTML(part.fqcn)}</a>`
      : `<span class='module'>${quoteHTML(part.fqcn)}</span>`,
  formatRSTRef: (part) => `<span class='module'>${quoteHTML(part.text)}</span>`,
  formatURL: (part) => `<a href='${quoteHTMLArg(encodeURI(part.url))}'>${quoteHTML(part.url)}</a>`,
  formatText: (part) => quoteHTML(part.text),
  formatEnvVariable: (part) => `<code class="xref std std-envvar literal notranslate">${quoteHTML(part.name)}</code>`,
  formatOptionName: (part, url) => formatOptionLikeAntsibullDocs(part, url, 'option'),
  formatOptionValue: (part) => `<code class="ansible-value literal notranslate">${quoteHTML(part.value)}</code>`,
  formatPlugin: (part, url) =>
    url
      ? `<a href='${quoteHTMLArg(encodeURI(url))}' class='module'>${quoteHTML(part.plugin.fqcn)}</a>`
      : `<span class='module'>${quoteHTML(part.plugin.fqcn)}</span>`,
  formatReturnValue: (part, url) => formatOptionLikeAntsibullDocs(part, url, 'retval'),
};

export function toHTML(paragraphs: Paragraph[], opts?: HTMLOptions): string {
  opts = opts ?? {};
  const style = opts.style || 'antsibull-docs';
  const mergedOpts = mergeOpts(opts, style === 'antsibull-docs' ? ANTSIBULL_DOCS_FORMATTER : PLAIN_FORMATTER);
  const result: string[] = [];
  const parStart = opts.parStart ?? '<p>';
  const parEnd = opts.parEnd ?? '</p>';
  for (const paragraph of paragraphs) {
    result.push(parStart);
    addToDestination(result, paragraph, mergedOpts);
    result.push(parEnd);
  }
  return result.join('');
}
