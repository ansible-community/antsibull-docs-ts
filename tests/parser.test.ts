/*
  GNU General Public License v3.0+ (see LICENSES/GPL-3.0-or-later.txt or https://www.gnu.org/licenses/gpl-3.0.txt)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: GPL-3.0-or-later
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
