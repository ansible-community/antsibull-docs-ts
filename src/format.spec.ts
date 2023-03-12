/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { AllFormatOptions, LinkProviders, CommonExportOptions } from './opts';
import { addToDestination } from './format';
import { PartType } from './dom';

describe('basic tests', () => {
  const allFormatOptions: AllFormatOptions & LinkProviders & CommonExportOptions = {
    formatError: () => 'formatError',
    formatBold: () => 'formatBold',
    formatCode: () => 'formatCode',
    formatHorizontalLine: () => 'formatHorizontalLine',
    formatItalic: () => 'formatItalic',
    formatLink: () => 'formatLink',
    formatModule: () => 'formatModule',
    formatRSTRef: () => 'formatRSTRef',
    formatURL: () => 'formatURL',
    formatText: () => 'formatText',
    formatEnvVariable: () => 'formatEnvVariable',
    formatOptionName: () => 'formatOptionName',
    formatOptionValue: () => 'formatOptionValue',
    formatPlugin: () => 'formatPlugin',
    formatReturnValue: () => 'formatReturnValue',
  };

  it('empty', () => {
    const result: string[] = [];
    addToDestination(result, [], allFormatOptions);
    expect(result).toEqual([]);
  });
  it('simple', () => {
    const result: string[] = [];
    addToDestination(
      result,
      [{ type: PartType.HORIZONTAL_LINE }, { type: PartType.TEXT, text: 'foo' }],
      allFormatOptions,
    );
    expect(result).toEqual(['formatHorizontalLine', 'formatText']);
  });
});
