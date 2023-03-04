/*
  GNU General Public License v3.0+ (see LICENSES/GPL-3.0-or-later.txt or https://www.gnu.org/licenses/gpl-3.0.txt)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: GPL-3.0-or-later
*/

export interface ParsingOptions {
  ignoreErrors?: boolean;
}

export enum PartType {
  TEXT = 1,
}

export interface Part {
  type: PartType;
}

export interface TextPart extends Part {
  type: PartType.TEXT;
  text: string;
}

export type APart = TextPart;

export type Paragraph = APart[];

/**
  Parses a string or a list of strings to a list of paragraphs.
 */
export function parse(input: string | string[], opts?: ParsingOptions): Paragraph[] {
  if (!opts) {
    opts = {};
  }
  if (typeof input === 'string') {
    input = input ? [input] : [];
  }
  const result: Paragraph[] = [];
  for (const par of input) {
    const paragraph: APart[] = [];
    if (par) {
      paragraph.push({ type: PartType.TEXT, text: par });
    }
    result.push(paragraph);
  }
  return result;
}
