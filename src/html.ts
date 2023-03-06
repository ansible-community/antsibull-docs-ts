/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { HTMLOptions } from './opts';
import { PartType, Paragraph } from './parser';

export function quoteHTML(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function toHTML(paragraphs: Paragraph[], opts?: HTMLOptions): string {
  if (!opts) {
    opts = {};
  }
  const result: string[] = [];
  for (const paragraph of paragraphs) {
    result.push('<p>');
    for (const part of paragraph) {
      switch (part.type) {
        case PartType.ERROR:
          result.push(`<span class="error">ERROR while parsing: ${quoteHTML(part.message)}</span>`);
          break;
        case PartType.BOLD:
          result.push(`<b>${quoteHTML(part.text)}</b>`);
          break;
        case PartType.CODE:
          result.push(`<code class='docutils literal notranslate'>${quoteHTML(part.text)}</code>`);
          break;
        case PartType.HORIZONTAL_LINE:
          result.push('<hr/>');
          break;
        case PartType.ITALIC:
          result.push(`<em>${quoteHTML(part.text)}</em>`);
          break;
        case PartType.LINK:
          result.push(`<a href='${quoteHTML(encodeURI(part.url))}'>${quoteHTML(part.text)}</a>`);
          break;
        case PartType.MODULE: {
          let url: string | undefined;
          if (opts.pluginLink) {
            url = opts.pluginLink({ fqcn: part.fqcn, type: 'module' });
          }
          if (url) {
            result.push(`<a href='${url}' class='module'>${quoteHTML(part.fqcn)}</a>`);
          } else {
            result.push(`<span class='module'>${quoteHTML(part.fqcn)}</span>`);
          }
          break;
        }
        case PartType.RST_REF:
          result.push(`<span class='module'>${quoteHTML(part.text)}</span>`);
          break;
        case PartType.URL:
          result.push(`<a href='${quoteHTML(encodeURI(part.url))}'>${quoteHTML(encodeURI(part.url))}</a>`);
          break;
        case PartType.TEXT:
          result.push(quoteHTML(part.text));
          break;
      }
    }
    result.push('</p>');
  }
  return result.join('');
}
