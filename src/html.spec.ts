/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import * as parser from './parser';
import { quoteHTML, toHTML } from './html';

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
    expect(toHTML([[{ type: parser.PartType.TEXT, text: 'test' }]])).toBe('<p>test</p>');
  });
});
