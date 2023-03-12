/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { quoteRST, toRST } from './rst';
import { PartType } from './dom';

describe('quoteRST tests', (): void => {
  it('empty string', (): void => {
    expect(quoteRST('')).toBe('');
  });
  it('simple string', (): void => {
    expect(quoteRST('  foo  ')).toBe('  foo  ');
  });
  it('simple string, escape leading spacing', (): void => {
    expect(quoteRST('  foo  ', true)).toBe('\\   foo  ');
  });
  it('simple string, escape ending spacing', (): void => {
    expect(quoteRST('  foo  ', false, true)).toBe('  foo  \\ ');
  });
  it('simple string, escape spacing', (): void => {
    expect(quoteRST('  foo  ', true, true)).toBe('\\   foo  \\ ');
  });
  it('more complex', (): void => {
    expect(quoteRST('\\<_>`*<_>*`\\')).toBe('\\\\\\<\\_\\>\\`\\*\\<\\_\\>\\*\\`\\\\');
  });
});

describe('toRST tests', (): void => {
  it('no paragraphs', (): void => {
    expect(toRST([])).toBe('');
  });
  it('single paragraph with simple text', (): void => {
    expect(toRST([[{ type: PartType.TEXT, text: 'test' }]])).toBe('test');
  });
});
