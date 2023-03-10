/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

// CommonMark spec: https://spec.commonmark.org/current/

import { MDOptions } from './opts';
import { PartType, Paragraph } from './parser';

export function quoteMD(text: string): string {
  return text.replace(/([!"#$%&'()*+,:;<=>?@\[\\\]^_`{|}~-])/g, '\\$1');
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
        case PartType.MODULE:
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
        case PartType.RST_REF:
          line.push(`${quoteMD(part.text)}`);
          break;
        case PartType.URL:
          line.push(`[${quoteMD(encodeURI(part.url))}](${quoteMD(encodeURI(part.url))})`);
          break;
        case PartType.TEXT:
          line.push(quoteMD(part.text));
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
