/*
  GNU General Public License v3.0+ (see LICENSES/GPL-3.0-or-later.txt or https://www.gnu.org/licenses/gpl-3.0.txt)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: GPL-3.0-or-later
*/

import { PartType, Paragraph } from './parser';

export function quoteHTML(text: string): string {
  // TODO
  return text;
}

export function toHTML(paragraphs: Paragraph[]): string {
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
