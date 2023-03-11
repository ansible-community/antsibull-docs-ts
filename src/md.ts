/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

// CommonMark spec: https://spec.commonmark.org/current/

import { MDOptions } from './opts';
import { OptionNamePart, PartType, Paragraph, ReturnValuePart } from './parser';

export function quoteMD(text: string): string {
  return text.replace(/([!"#$%&'()*+,:;<=>?@[\\\]^_`{|}~-])/g, '\\$1');
}

function formatOptionLike(part: OptionNamePart | ReturnValuePart, what: 'option' | 'retval', opts: MDOptions): string {
  let url: string | undefined;
  if (part.plugin && opts.pluginOptionLikeLink) {
    url = opts.pluginOptionLikeLink(part.plugin, what, part.link, part.plugin === opts.current_plugin);
  }
  let link_start = '';
  let link_end = '';
  if (url) {
    link_start = `<a href="${quoteMD(encodeURI(url))}">`;
    link_end = '</a>';
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
  return `<code class="${cls}">${strong_start}${link_start}${quoteMD(text)}${link_end}${strong_end}</code>`;
}

export function toMD(paragraphs: Paragraph[], opts?: MDOptions): string {
  if (!opts) {
    opts = {};
  }
  const result: string[] = [];
  for (const paragraph of paragraphs) {
    const line: string[] = [];
    for (const part of paragraph) {
      switch (part.type) {
        case PartType.ERROR:
          line.push(`\\ :strong:\`ERROR while parsing\`\\ : ${part.message}\\ `);
          break;
        case PartType.BOLD:
          line.push(`<b>${quoteMD(part.text)}</b>`);
          break;
        case PartType.CODE:
          line.push(`<code>${quoteMD(part.text)}</code>`);
          break;
        case PartType.HORIZONTAL_LINE:
          line.push('<hr>');
          break;
        case PartType.ITALIC:
          line.push(`<em>${quoteMD(part.text)}</em>`);
          break;
        case PartType.LINK:
          line.push(`[${quoteMD(part.text)}](${quoteMD(encodeURI(part.url))})`);
          break;
        case PartType.MODULE: {
          let url: string | undefined;
          if (opts.pluginLink) {
            url = opts.pluginLink({ fqcn: part.fqcn, type: 'module' });
          }
          if (url) {
            line.push(`[${quoteMD(part.fqcn)}](${quoteMD(encodeURI(url))})`);
          } else {
            line.push(`${quoteMD(part.fqcn)}`);
          }
          break;
        }
        case PartType.RST_REF:
          line.push(`${quoteMD(part.text)}`);
          break;
        case PartType.URL:
          line.push(`[${quoteMD(encodeURI(part.url))}](${quoteMD(encodeURI(part.url))})`);
          break;
        case PartType.TEXT:
          line.push(quoteMD(part.text));
          break;
        case PartType.ENV_VARIABLE:
          line.push(`<code>${quoteMD(part.name)}</code>`);
          break;
        case PartType.OPTION_NAME:
          line.push(formatOptionLike(part, 'option', opts));
          break;
        case PartType.OPTION_VALUE:
          line.push(`<code>${quoteMD(part.value)}</code>`);
          break;
        case PartType.PLUGIN: {
          let url: string | undefined;
          if (opts.pluginLink) {
            url = opts.pluginLink(part.plugin);
          }
          if (url) {
            line.push(`[${quoteMD(part.plugin.fqcn)}](${quoteMD(encodeURI(url))})`);
          } else {
            line.push(`${quoteMD(part.plugin.fqcn)}`);
          }
          break;
        }
        case PartType.RETURN_VALUE:
          line.push(formatOptionLike(part, 'retval', opts));
          break;
      }
    }
    if (!line.length) {
      line.push(' ');
    }
    result.push(line.join(''));
  }
  return result.join('\n\n');
}
