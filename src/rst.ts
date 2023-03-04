/*
  GNU General Public License v3.0+ (see LICENSES/GPL-3.0-or-later.txt or https://www.gnu.org/licenses/gpl-3.0.txt)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: GPL-3.0-or-later
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
