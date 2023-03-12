/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { parseEscapedArgs, parseUnescapedArgs } from './parser-impl';

describe('parse escaped args', (): void => {
  it('parse tests', (): void => {
    expect(parseEscapedArgs('(a)', 1, 1)).toEqual([['a'], 3, undefined]);
    expect(parseEscapedArgs('(a,b)', 1, 1)).toEqual([['a,b'], 5, undefined]);
    expect(parseEscapedArgs('(a,b,c)', 1, 1)).toEqual([['a,b,c'], 7, undefined]);
    expect(parseEscapedArgs('(a,b)', 1, 2)).toEqual([['a', 'b'], 5, undefined]);
    expect(parseEscapedArgs('(a,b,c)', 1, 2)).toEqual([['a', 'b,c'], 7, undefined]);
    expect(parseEscapedArgs('(a,b,c)', 1, 3)).toEqual([['a', 'b', 'c'], 7, undefined]);
    expect(parseEscapedArgs('(a\\,,b\\,\\),c\\))', 1, 3)).toEqual([['a,', 'b,)', 'c)'], 15, undefined]);
  });
  it('error tests)', (): void => {
    expect(parseEscapedArgs('(a', 1, 1)).toEqual([[''], 2, 'Cannot find closing ")" after last parameter']);
    expect(parseEscapedArgs('(a', 1, 2)).toEqual([
      [''],
      2,
      'Cannot find comma separating parameter 1 from the next one',
    ]);
    expect(parseEscapedArgs('(a,b', 1, 2)).toEqual([['a', ''], 4, 'Cannot find closing ")" after last parameter']);
  });
});

describe('parse unescaped args', (): void => {
  it('parse tests', (): void => {
    expect(parseUnescapedArgs('(a)', 1, 1)).toEqual([['a'], 3, undefined]);
    expect(parseUnescapedArgs('(a,b)', 1, 1)).toEqual([['a,b'], 5, undefined]);
    expect(parseUnescapedArgs('(a,b,c)', 1, 1)).toEqual([['a,b,c'], 7, undefined]);
    expect(parseUnescapedArgs('(a,b)', 1, 2)).toEqual([['a', 'b'], 5, undefined]);
    expect(parseUnescapedArgs('(a,b,c)', 1, 2)).toEqual([['a', 'b,c'], 7, undefined]);
    expect(parseUnescapedArgs('(a,b,c)', 1, 3)).toEqual([['a', 'b', 'c'], 7, undefined]);
  });
  it('error tests)', (): void => {
    expect(parseUnescapedArgs('(a', 1, 1)).toEqual([[], 2, 'Cannot find closing ")" after last parameter']);
    expect(parseUnescapedArgs('(a', 1, 2)).toEqual([
      [],
      2,
      'Cannot find comma separating parameter 1 from the next one',
    ]);
    expect(parseUnescapedArgs('(a,b', 1, 2)).toEqual([['a'], 4, 'Cannot find closing ")" after last parameter']);
  });
});
