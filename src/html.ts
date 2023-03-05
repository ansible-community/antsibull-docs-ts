/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { HTMLOptions } from './opts';
import { PartType, Paragraph } from './parser';

export function quoteHTML(text: string): string {
  return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
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
        case PartType.TEXT:
          result.push(quoteHTML(part.text));
          break;
      }
    }
    result.push('</p>');
  }
  return result.join('');
}
