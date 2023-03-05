/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
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
