/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { quoteMD, toMD, postprocessMDParagraph } from './md';
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

describe('postprocessMDParagraph tests', (): void => {
  it('empty string', (): void => {
    expect(postprocessMDParagraph('')).toBe('');
  });
  it('string with some whitespace', (): void => {
    expect(postprocessMDParagraph(' \n foo \n\r\n \n\tbar \n ')).toBe('foo\nbar');
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
