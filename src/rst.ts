/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { PartType, Paragraph } from './parser';

export function quoteRST(text: string): string {
  // TODO
  return text;
}

export function toRST(paragraphs: Paragraph[]): string {
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
      line.push(' \\');
    }
    result.push(line.join(''));
  }
  return result.join('\n\n');
}
