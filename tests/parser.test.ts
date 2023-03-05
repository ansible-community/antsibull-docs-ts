/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { expect } from 'chai';

import { parse, PartType } from '../src/parser';

describe('parser tests', (): void => {
  it('empty string', (): void => {
    expect(parse('')).to.deep.equal([]);
  });
  it('array with empty string', (): void => {
    expect(parse([''])).to.deep.equal([[]]);
  });
  it('simple string', (): void => {
    expect(parse('test')).to.deep.equal([[{ type: PartType.TEXT, text: 'test' }]]);
  });
});
