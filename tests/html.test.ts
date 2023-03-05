/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { expect } from 'chai';

import * as parser from '../src/parser';
import { quoteHTML, toHTML } from '../src/html';

describe('quoteHTML tests', (): void => {
  it('empty string', (): void => {
    expect(quoteHTML('')).is.equal('');
  });
});

describe('toHTML tests', (): void => {
  it('no paragraphs', (): void => {
    expect(toHTML([[{ type: parser.PartType.TEXT, text: 'test' }]])).is.equal('<p>test</p>');
  });
});
