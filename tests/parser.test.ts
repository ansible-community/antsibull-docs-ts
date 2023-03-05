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
  it('basic markup test', (): void => {
    expect(
      parse(
        'foo I(bar) baz C( bam ) B( ( boo ) ) U(https://example.com/?foo=bar)L(foo ,  https://bar.com) R( a , b )M(foo.bar.baz)x M(foo.bar.baz.bam)',
      ),
    ).to.deep.equal([
      [
        { type: PartType.TEXT, text: 'foo ' },
        { type: PartType.ITALIC, text: 'bar' },
        { type: PartType.TEXT, text: ' baz ' },
        { type: PartType.CODE, text: ' bam ' },
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.BOLD, text: ' ( boo ' },
        { type: PartType.TEXT, text: ' ) ' },
        { type: PartType.URL, url: 'https://example.com/?foo=bar' },
        { type: PartType.LINK, text: 'foo', url: 'https://bar.com' },
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.RST_REF, text: ' a', ref: 'b ' },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz' },
        { type: PartType.TEXT, text: 'x ' },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz.bam' },
      ],
    ]);
  });
  it('bad parameter parsing (no escaping, throw error)', (): void => {
    expect(() => parse('M(')).to.throw('While parsing M() at index 1: Cannot find closing ")" after last parameter');
    expect(() => parse('M(foo')).to.throw('While parsing M() at index 1: Cannot find closing ")" after last parameter');
    expect(() => parse('L(foo)')).to.throw(
      'While parsing L() at index 1: Cannot find comma separating parameter 1 from the next one',
    );
    expect(() => parse('L(foo,bar')).to.throw(
      'While parsing L() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(() => parse('L(foo), bar')).to.throw(
      'While parsing L() at index 1: Cannot find closing ")" after last parameter',
    );
  });
  it('bad module ref (throw error)', (): void => {
    expect(() => parse('M(foo)')).to.throw('While parsing M() at index 1: Error: Module name "foo" is not a FQCN');
    expect(() => parse(' M(foo.bar)')).to.throw(
      'While parsing M() at index 2: Error: Module name "foo.bar" is not a FQCN',
    );
    expect(() => parse('  M(foo. bar.baz)')).to.throw(
      'While parsing M() at index 3: Error: Module name "foo. bar.baz" is not a FQCN',
    );
    expect(() => parse('   M(foo)')).to.throw('While parsing M() at index 4: Error: Module name "foo" is not a FQCN');
  });
  it('bad parameter parsing (no escaping, error message)', (): void => {
    expect(parse('M(', { errors: 'message' })).to.deep.equal([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('M(foo', { errors: 'message' })).to.deep.equal([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('L(foo)', { errors: 'message' })).to.deep.equal([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing L() at index 1: Cannot find comma separating parameter 1 from the next one',
        },
      ],
    ]);
    expect(parse('L(foo,bar', { errors: 'message' })).to.deep.equal([
      [{ type: PartType.ERROR, message: 'While parsing L() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('L(foo), bar', { errors: 'message' })).to.deep.equal([
      [{ type: PartType.ERROR, message: 'While parsing L() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
  });
  it('bad module ref (error message)', (): void => {
    expect(parse('M(foo)', { errors: 'message' })).to.deep.equal([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Error: Module name "foo" is not a FQCN' }],
    ]);
    expect(parse(' M(foo.bar)', { errors: 'message' })).to.deep.equal([
      [
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.ERROR, message: 'While parsing M() at index 2: Error: Module name "foo.bar" is not a FQCN' },
      ],
    ]);
    expect(parse('  M(foo. bar.baz)', { errors: 'message' })).to.deep.equal([
      [
        { type: PartType.TEXT, text: '  ' },
        {
          type: PartType.ERROR,
          message: 'While parsing M() at index 3: Error: Module name "foo. bar.baz" is not a FQCN',
        },
      ],
    ]);
    expect(parse('   M(foo) baz', { errors: 'message' })).to.deep.equal([
      [
        { type: PartType.TEXT, text: '   ' },
        { type: PartType.ERROR, message: 'While parsing M() at index 4: Error: Module name "foo" is not a FQCN' },
        { type: PartType.TEXT, text: ' baz' },
      ],
    ]);
  });
  it('bad parameter parsing (no escaping, ignore error)', (): void => {
    expect(parse('M(', { errors: 'ignore' })).to.deep.equal([[]]);
    expect(parse('M(foo', { errors: 'ignore' })).to.deep.equal([[]]);
    expect(parse('L(foo)', { errors: 'ignore' })).to.deep.equal([[]]);
    expect(parse('L(foo,bar', { errors: 'ignore' })).to.deep.equal([[]]);
    expect(parse('L(foo), bar', { errors: 'ignore' })).to.deep.equal([[]]);
  });
  it('bad module ref (ignore error)', (): void => {
    expect(parse('M(foo)', { errors: 'ignore' })).to.deep.equal([[]]);
    expect(parse(' M(foo.bar)', { errors: 'ignore' })).to.deep.equal([[{ type: PartType.TEXT, text: ' ' }]]);
    expect(parse('  M(foo. bar.baz)', { errors: 'ignore' })).to.deep.equal([[{ type: PartType.TEXT, text: '  ' }]]);
    expect(parse('   M(foo) baz', { errors: 'ignore' })).to.deep.equal([
      [
        { type: PartType.TEXT, text: '   ' },
        { type: PartType.TEXT, text: ' baz' },
      ],
    ]);
  });
});
