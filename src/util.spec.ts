/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { splitLines, startsWith, endsWith } from './util';

describe('splitLines tests', (): void => {
  it('empty string', (): void => {
    expect(splitLines('')).toStrictEqual([]);
  });
  it('single line-break', (): void => {
    expect(splitLines('\n')).toStrictEqual(['']);
  });
  it('two lines', (): void => {
    expect(splitLines('a\nb')).toStrictEqual(['a', 'b']);
  });
  it('two lines ending with newline', (): void => {
    expect(splitLines('a\nb\n')).toStrictEqual(['a', 'b']);
  });
});

describe('startsWith tests', (): void => {
  it('empty string', (): void => {
    expect(startsWith('', ' ')).toBe(false);
  });
  it('middle match', (): void => {
    expect(startsWith(' a ', ' ', 1, 2)).toBe(false);
    expect(startsWith(' a ', 'a', 1, 2)).toBe(true);
  });
  it('no end', (): void => {
    expect(startsWith(' a ', ' ', 1)).toBe(false);
    expect(startsWith(' a ', 'a', 1)).toBe(true);
  });
  it('middle match too long', (): void => {
    expect(startsWith(' a ', 'a ', 1, 2)).toBe(false);
  });
});

describe('endsWith tests', (): void => {
  it('empty string', (): void => {
    expect(endsWith('', ' ')).toBe(false);
  });
  it('middle match', (): void => {
    expect(endsWith(' a ', ' ', 1, 2)).toBe(false);
    expect(endsWith(' a ', 'a', 1, 2)).toBe(true);
  });
  it('no end', (): void => {
    expect(endsWith(' a', ' ', 1)).toBe(false);
    expect(endsWith(' a', 'a', 1)).toBe(true);
  });
  it('middle match too long', (): void => {
    expect(endsWith(' a ', 'a ', 1, 2)).toBe(false);
  });
});
