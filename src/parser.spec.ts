/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { parse, PartType } from './parser';

describe('parser tests', (): void => {
  it('empty string', (): void => {
    expect(parse('')).toEqual([]);
  });
  it('array with empty string', (): void => {
    expect(parse([''])).toEqual([[]]);
  });
  it('simple string', (): void => {
    expect(parse('test')).toEqual([[{ type: PartType.TEXT, text: 'test' }]]);
  });
  it('classic markup test', (): void => {
    expect(
      parse(
        'foo I(bar) baz C( bam ) B( ( boo ) ) U(https://example.com/?foo=bar)HORIZONTALLINE L(foo ,  https://bar.com) R( a , b )M(foo.bar.baz)HORIZONTALLINEx M(foo.bar.baz.bam)',
      ),
    ).toEqual([
      [
        { type: PartType.TEXT, text: 'foo ' },
        { type: PartType.ITALIC, text: 'bar' },
        { type: PartType.TEXT, text: ' baz ' },
        { type: PartType.CODE, text: ' bam ' },
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.BOLD, text: ' ( boo ' },
        { type: PartType.TEXT, text: ' ) ' },
        { type: PartType.URL, url: 'https://example.com/?foo=bar' },
        { type: PartType.HORIZONTAL_LINE },
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.LINK, text: 'foo', url: 'https://bar.com' },
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.RST_REF, text: ' a', ref: 'b ' },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz' },
        { type: PartType.TEXT, text: 'HORIZONTALLINEx ' },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz.bam' },
      ],
    ]);
  });
  it('bad parameter parsing (no escaping, throw error)', (): void => {
    expect(async () => parse('M(', { errors: 'exception' })).rejects.toThrow(
      'While parsing M() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('M(foo', { errors: 'exception' })).rejects.toThrow(
      'While parsing M() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('L(foo)', { errors: 'exception' })).rejects.toThrow(
      'While parsing L() at index 1: Cannot find comma separating parameter 1 from the next one',
    );
    expect(async () => parse('L(foo,bar', { errors: 'exception' })).rejects.toThrow(
      'While parsing L() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('L(foo), bar', { errors: 'exception' })).rejects.toThrow(
      'While parsing L() at index 1: Cannot find closing ")" after last parameter',
    );
  });
  it('bad module ref (throw error)', (): void => {
    expect(async () => parse('M(foo)', { errors: 'exception' })).rejects.toThrow(
      'While parsing M() at index 1: Error: Module name "foo" is not a FQCN',
    );
    expect(async () => parse(' M(foo.bar)', { errors: 'exception' })).rejects.toThrow(
      'While parsing M() at index 2: Error: Module name "foo.bar" is not a FQCN',
    );
    expect(async () => parse('  M(foo. bar.baz)', { errors: 'exception' })).rejects.toThrow(
      'While parsing M() at index 3: Error: Module name "foo. bar.baz" is not a FQCN',
    );
    expect(async () => parse('   M(foo)', { errors: 'exception' })).rejects.toThrow(
      'While parsing M() at index 4: Error: Module name "foo" is not a FQCN',
    );
  });
  it('bad parameter parsing (no escaping, error message)', (): void => {
    expect(parse('M(')).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('M(foo', { errors: 'message' })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('L(foo)', { errors: 'message' })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing L() at index 1: Cannot find comma separating parameter 1 from the next one',
        },
      ],
    ]);
    expect(parse('L(foo,bar', { errors: 'message' })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing L() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('L(foo), bar', { errors: 'message' })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing L() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
  });
  it('bad module ref (error message)', (): void => {
    expect(parse('M(foo)')).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Error: Module name "foo" is not a FQCN' }],
    ]);
    expect(parse(' M(foo.bar)', { errors: 'message' })).toEqual([
      [
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.ERROR, message: 'While parsing M() at index 2: Error: Module name "foo.bar" is not a FQCN' },
      ],
    ]);
    expect(parse('  M(foo. bar.baz)', { errors: 'message' })).toEqual([
      [
        { type: PartType.TEXT, text: '  ' },
        {
          type: PartType.ERROR,
          message: 'While parsing M() at index 3: Error: Module name "foo. bar.baz" is not a FQCN',
        },
      ],
    ]);
    expect(parse('   M(foo) baz', { errors: 'message' })).toEqual([
      [
        { type: PartType.TEXT, text: '   ' },
        { type: PartType.ERROR, message: 'While parsing M() at index 4: Error: Module name "foo" is not a FQCN' },
        { type: PartType.TEXT, text: ' baz' },
      ],
    ]);
  });
  it('bad parameter parsing (no escaping, ignore error)', (): void => {
    expect(parse('M(', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('M(foo', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('L(foo)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('L(foo,bar', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('L(foo), bar', { errors: 'ignore' })).toEqual([[]]);
  });
  it('bad module ref (ignore error)', (): void => {
    expect(parse('M(foo)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse(' M(foo.bar)', { errors: 'ignore' })).toEqual([[{ type: PartType.TEXT, text: ' ' }]]);
    expect(parse('  M(foo. bar.baz)', { errors: 'ignore' })).toEqual([[{ type: PartType.TEXT, text: '  ' }]]);
    expect(parse('   M(foo) baz', { errors: 'ignore' })).toEqual([
      [
        { type: PartType.TEXT, text: '   ' },
        { type: PartType.TEXT, text: ' baz' },
      ],
    ]);
  });
});
