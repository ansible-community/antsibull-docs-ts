/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { quoteRST, toRST, postprocessRSTParagraph } from './rst';
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
    expect(quoteRST('  foo  ', true, true, true)).toBe('\\   foo  \\ ');
  });
  it('simple string, escape empty', (): void => {
    expect(quoteRST('', true, true, true)).toBe('\\ ');
  });
  it('more complex', (): void => {
    expect(quoteRST('\\<_>`*<_>*`\\')).toBe('\\\\\\<\\_\\>\\`\\*\\<\\_\\>\\*\\`\\\\');
  });
});

describe('postprocessRSTParagraph tests', (): void => {
  it('empty string', (): void => {
    expect(postprocessRSTParagraph('')).toBe('');
  });
  it('string with some whitespace', (): void => {
    expect(postprocessRSTParagraph(' \n foo \n\r\n \n\tbar \n ')).toBe('foo\nbar');
  });
  it('iteratively collapsing whitespace and escaped spaces', (): void => {
    expect(postprocessRSTParagraph('\\ foo\\  \\  bar \\  \\ \n\nf\\ oo')).toBe('foo  bar\nf\\ oo');
  });
  it('collapsing multiple escaped spaces', (): void => {
    expect(postprocessRSTParagraph('a\\ \\ \\ \\ \\ b')).toBe('a\\ b');
  });
  it('iteratively collapsing whitespace and escaped spaces at end of line', (): void => {
    expect(postprocessRSTParagraph('a\\ \\  \\ \\    \\ \\  ')).toBe('a');
  });
  it('iteratively collapsing whitespace and escaped spaces at start of line', (): void => {
    expect(postprocessRSTParagraph('\\ \\  \\ \\    \\ \\  a')).toBe('a');
  });
  it('iteratively collapsing whitespace and escaped spaces composing the line', (): void => {
    expect(postprocessRSTParagraph('\\ \\  \\ \\    \\ \\  ')).toBe('');
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
