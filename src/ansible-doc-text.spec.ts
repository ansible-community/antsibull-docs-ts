/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { toAnsibleDocText } from './ansible-doc-text';
import { PartType } from './dom';

describe('toRST tests', (): void => {
  it('no paragraphs', (): void => {
    expect(toAnsibleDocText([])).toBe('');
  });
  it('single paragraph with simple text', (): void => {
    expect(toAnsibleDocText([[{ type: PartType.TEXT, text: 'test' }]])).toBe('test');
  });
});
