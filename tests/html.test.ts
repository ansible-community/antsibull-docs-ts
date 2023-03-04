/*
  GNU General Public License v3.0+ (see LICENSES/GPL-3.0-or-later.txt or https://www.gnu.org/licenses/gpl-3.0.txt)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: GPL-3.0-or-later
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
