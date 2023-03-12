/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { HTMLOptions } from './opts';
import { OptionNamePart, PartType, Paragraph, ReturnValuePart } from './dom';

export function quoteHTML(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatOptionLike(
  part: OptionNamePart | ReturnValuePart,
  what: 'option' | 'retval',
  opts: HTMLOptions,
): string {
  let url: string | undefined;
  if (part.plugin && opts.pluginOptionLikeLink) {
    url = opts.pluginOptionLikeLink(part.plugin, what, part.link, part.plugin === opts.current_plugin);
  }
  let link_start = '';
  let link_end = '';
  if (url) {
    link_start = `<a class="reference internal" href="${quoteHTML(
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
        case PartType.ENV_VARIABLE:
          result.push(`<code class="xref std std-envvar literal notranslate">${quoteHTML(part.name)}</code>`);
          break;
        case PartType.OPTION_NAME:
          result.push(formatOptionLike(part, 'option', opts));
          break;
        case PartType.OPTION_VALUE:
          result.push(`<code class="ansible-value literal notranslate">${quoteHTML(part.value)}</code>`);
          break;
        case PartType.PLUGIN: {
          let url: string | undefined;
          if (opts.pluginLink) {
            url = opts.pluginLink(part.plugin);
          }
          if (url) {
            result.push(`<a href='${url}' class='module'>${quoteHTML(part.plugin.fqcn)}</a>`);
          } else {
            result.push(`<span class='module'>${quoteHTML(part.plugin.fqcn)}</span>`);
          }
          break;
        }
        case PartType.RETURN_VALUE:
          result.push(formatOptionLike(part, 'retval', opts));
          break;
      }
    }
    result.push('</p>');
  }
  return result.join('');
}
