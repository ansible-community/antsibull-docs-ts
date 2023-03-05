/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
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
