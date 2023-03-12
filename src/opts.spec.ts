/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { mergeOpts, AllFormatOptions } from './opts';

describe('mergeOpts', (): void => {
  const allFormatOptions: AllFormatOptions = {
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

  it('assignment with empty', (): void => {
    expect(mergeOpts({}, allFormatOptions)).toEqual(allFormatOptions);
  });
  it('assignment with undefined', (): void => {
    expect(
      mergeOpts(
        {
          formatError: undefined,
          formatBold: undefined,
          formatCode: undefined,
          formatHorizontalLine: undefined,
          formatItalic: undefined,
          formatLink: undefined,
          formatModule: undefined,
          formatRSTRef: undefined,
          formatURL: undefined,
          formatText: undefined,
          formatEnvVariable: undefined,
          formatOptionName: undefined,
          formatOptionValue: undefined,
          formatPlugin: undefined,
          formatReturnValue: undefined,
        },
        allFormatOptions,
      ),
    ).toEqual(allFormatOptions);
  });
});
