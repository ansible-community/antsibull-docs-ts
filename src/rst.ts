/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { RSTOptions } from './opts';
import { PartType, Paragraph } from './parser';

export function quoteRST(text: string, escape_starting_whitespace = false, escape_ending_whitespace = false): string {
  text = text
    .replace(/\\/g, '\\\\')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>')
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/`/g, '\\`');

  if (escape_ending_whitespace && text.endsWith(' ')) {
    text = text + '\\ ';
  }
  if (escape_starting_whitespace && text.startsWith(' ')) {
    text = '\\ ' + text;
  }
  return text;
}

export function toRST(paragraphs: Paragraph[], opts?: RSTOptions): string {
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
          line.push(`\\ :strong:\`${quoteRST(part.text, true, true)}\`\\ `);
          break;
        case PartType.CODE:
          line.push(`\\ :literal:\`${quoteRST(part.text, true, true)}\`\\ `);
          break;
        case PartType.HORIZONTAL_LINE:
          line.push('\n\n.. raw:: html\n\n  <hr>\n\n');
          break;
        case PartType.ITALIC:
          line.push(`\\ :emphasis:\`${quoteRST(part.text, true, true)}\`\\ `);
          break;
        case PartType.LINK:
          line.push(`\\ \`${quoteRST(part.text)} <${encodeURI(part.url)}>\`__\\ `);
          break;
        case PartType.MODULE:
          line.push(`\\ :ref:\`${quoteRST(part.fqcn)} <ansible_collections.${part.fqcn}_module>\`\\ `);
          break;
        case PartType.RST_REF:
          line.push(`\\ :ref:\`${quoteRST(part.text)} <${part.ref}>\`\\ `);
          break;
        case PartType.URL:
          line.push(`\\ ${encodeURI(part.url)}\\ `);
          break;
        case PartType.TEXT:
          line.push(quoteRST(part.text));
          break;
      }
    }
    if (!line.length) {
      line.push('\\ ');
    }
    result.push(line.join(''));
  }
  return result.join('\n\n');
}
