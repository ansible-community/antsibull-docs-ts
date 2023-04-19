/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { quoteMD, toMD } from './md';
import { PartType } from './dom';

describe('quoteMD tests', (): void => {
  it('empty string', (): void => {
    expect(quoteMD('')).toBe('');
  });
  it('simple string', (): void => {
    expect(quoteMD('  foo  ')).toBe('  foo  ');
  });
  it('more complex', (): void => {
    expect(quoteMD('[]!.()-\\@<>?[]!.()-\\@<>?&')).toBe(
      '\\[\\]\\!\\.\\(\\)\\-\\\\\\@\\<\\>\\?\\[\\]\\!\\.\\(\\)\\-\\\\\\@\\<\\>\\?\\&',
    );
  });
});

describe('toMD tests', (): void => {
  it('no paragraphs', (): void => {
    expect(toMD([])).toBe('');
  });
  it('single paragraph with simple text', (): void => {
    expect(toMD([[{ type: PartType.TEXT, text: 'test' }]])).toBe('test');
  });
});
