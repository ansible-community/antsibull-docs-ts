/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { quoteHTML, toHTML } from './html';
import { PartType } from './dom';

describe('quoteHTML tests', (): void => {
  it('empty string', (): void => {
    expect(quoteHTML('')).toBe('');
  });
  it('simple string', (): void => {
    expect(quoteHTML('foo')).toBe('foo');
  });
  it('more complex', (): void => {
    expect(quoteHTML('<a href="a&b">&lt;&amp;&gt;</a>')).toBe(
      '&lt;a href="a&amp;b"&gt;&amp;lt;&amp;amp;&amp;gt;&lt;/a&gt;',
    );
  });
});

describe('toHTML tests', (): void => {
  it('no paragraphs', (): void => {
    expect(toHTML([])).toBe('');
  });
  it('single paragraphs', (): void => {
    expect(toHTML([[{ type: PartType.TEXT, text: 'test' }]])).toBe('<p>test</p>');
  });
  it('different paragraph start/end', (): void => {
    expect(toHTML([[{ type: PartType.TEXT, text: 'test' }]], { parStart: '<div>', parEnd: '</div>' })).toBe(
      '<div>test</div>',
    );
  });
});
