/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

// CommonMark spec: https://spec.commonmark.org/current/

import { MDOptions, AllFormatOptions, mergeOpts } from './opts';
import { OptionNamePart, Paragraph, ReturnValuePart } from './dom';
import { quoteHTMLArg } from './html';
import { addToDestination } from './format';
import { splitLines } from './util';

export function quoteMD(text: string): string {
  return text.replace(/([!"#$%&'()*+,:;<=>?@[\\\]^_`{|}~.-])/g, '\\$1');
}

export function postprocessMDParagraph(par: string): string {
  return splitLines(par.trim())
    .map((line) => line.trim().replace('\t', ' '))
    .filter(Boolean)
    .join('\n');
}

function formatOptionLike(
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
  if (what === 'option') {
    if (part.value === undefined) {
      strong_start = '<strong>';
      strong_end = '</strong>';
    }
  }
  let text: string;
  if (part.value === undefined) {
    text = part.name;
  } else {
    text = `${part.name}=${part.value}`;
  }
  return `<code>${strong_start}${link_start}${quoteMD(text)}${link_end}${strong_end}</code>`;
}

const DEFAULT_FORMATTER: AllFormatOptions = {
  formatError: (part) => `<b>ERROR while parsing</b>: ${quoteMD(part.message)}`,
  formatBold: (part) => `<b>${quoteMD(part.text)}</b>`,
  formatCode: (part) => `<code>${quoteMD(part.text)}</code>`,
  formatHorizontalLine: () => '<hr>',
  formatItalic: (part) => `<em>${quoteMD(part.text)}</em>`,
  formatLink: (part) => `[${quoteMD(part.text)}](${quoteMD(encodeURI(part.url))})`,
  formatModule: (part, url) => (url ? `[${quoteMD(part.fqcn)}](${quoteMD(encodeURI(url))})` : `${quoteMD(part.fqcn)}`),
  formatRSTRef: (part) => `${quoteMD(part.text)}`,
  formatURL: (part) => `[${quoteMD(part.url)}](${quoteMD(encodeURI(part.url))})`,
  formatText: (part) => quoteMD(part.text),
  formatEnvVariable: (part) => `<code>${quoteMD(part.name)}</code>`,
  formatOptionName: (part, url) => formatOptionLike(part, url, 'option'),
  formatOptionValue: (part) => `<code>${quoteMD(part.value)}</code>`,
  formatPlugin: (part, url) =>
    url ? `[${quoteMD(part.plugin.fqcn)}](${quoteMD(encodeURI(url))})` : `${quoteMD(part.plugin.fqcn)}`,
  formatReturnValue: (part, url) => formatOptionLike(part, url, 'retval'),
};

export function toMD(paragraphs: Paragraph[], opts?: MDOptions): string {
  const mergedOpts = mergeOpts(opts ?? {}, DEFAULT_FORMATTER);
  const result: string[] = [];
  for (const paragraph of paragraphs) {
    const line: string[] = [];
    addToDestination(line, paragraph, mergedOpts);
    const lineStr = postprocessMDParagraph(line.join(''));
    result.push(lineStr || ' ');
  }
  return result.join('\n\n');
}
