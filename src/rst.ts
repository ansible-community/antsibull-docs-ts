/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { RSTOptions } from './opts';
import { PartType, Paragraph } from './parser';

export function quoteRST(text: string, escape_starting_whitespace = false, escape_ending_whitespace = false): string {
  text = text
    .replace('\\', '\\\\')
    .replace('<', '\\<')
    .replace('>', '\\>')
    .replace('_', '\\_')
    .replace('*', '\\*')
    .replace('`', '\\`');

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
