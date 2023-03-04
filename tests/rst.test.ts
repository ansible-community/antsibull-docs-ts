/*
  GNU General Public License v3.0+ (see LICENSES/GPL-3.0-or-later.txt or https://www.gnu.org/licenses/gpl-3.0.txt)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: GPL-3.0-or-later
*/

import { expect } from 'chai';

import * as parser from '../src/parser';
import { quoteRST, toRST } from '../src/rst';

describe('quoteRST tests', (): void => {
  it('empty string', (): void => {
    expect(quoteRST('')).is.equal('');
  });
});

describe('toRST tests', (): void => {
  it('no paragraphs', (): void => {
    expect(toRST([])).is.equal('');
  });
  it('single paragraph with simple text', (): void => {
    expect(toRST([[{ type: parser.PartType.TEXT, text: 'test' }]])).is.equal('test');
  });
});
