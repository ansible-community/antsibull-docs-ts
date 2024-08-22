/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { processWhitespace, parse, composeCommandMap, composeCommandRE, CommandParser, parseString } from './parser';
import { PartType } from './dom';

describe('processWhitespace', (): void => {
  it('empty', (): void => {
    expect(processWhitespace('', 'strip', false, false)).toEqual('');
    expect(processWhitespace('', 'keep_single_newlines', false, false)).toEqual('');
  });
  it('one space', (): void => {
    expect(processWhitespace(' ', 'strip', false, false)).toEqual(' ');
    expect(processWhitespace(' ', 'keep_single_newlines', false, false)).toEqual(' ');
  });
  it('two spaces', (): void => {
    expect(processWhitespace('  ', 'strip', false, false)).toEqual(' ');
    expect(processWhitespace('  ', 'keep_single_newlines', false, false)).toEqual(' ');
  });
  it('newline', (): void => {
    expect(processWhitespace('\n', 'strip', false, false)).toEqual(' ');
    expect(processWhitespace('\n', 'keep_single_newlines', false, false)).toEqual('\n');
  });
  it('newline, no newlines allowed', (): void => {
    expect(processWhitespace('\n', 'strip', false, true)).toEqual(' ');
    expect(processWhitespace('\n', 'keep_single_newlines', false, true)).toEqual(' ');
  });
  it('complex', (): void => {
    const input = 'Foo \n\r\t\n\r Bar';
    expect(processWhitespace(input, 'strip', false, false)).toEqual('Foo Bar');
    expect(processWhitespace(input, 'keep_single_newlines', false, false)).toEqual('Foo\nBar');
  });
});

describe('parser', (): void => {
  it('empty string', (): void => {
    expect(parse('')).toEqual([]);
  });
  it('array with empty string', (): void => {
    expect(parse([''])).toEqual([[]]);
  });
  it('simple string', (): void => {
    expect(parse('test')).toEqual([[{ type: PartType.TEXT, text: 'test', source: undefined }]]);
  });
  it('simple string (with source)', (): void => {
    expect(parse('test', { addSource: true })).toEqual([[{ type: PartType.TEXT, text: 'test', source: 'test' }]]);
  });
  it('classic markup test', (): void => {
    expect(
      parse(
        'foo I(bar) baz C( bam ) B( ( boo ) ) U(https://example.com/?foo=bar)HORIZONTALLINE L(foo ,  https://bar.com) R( a , b )M(foo.bar.baz)HORIZONTALLINEx M(foo.bar.baz.bam)',
      ),
    ).toEqual([
      [
        { type: PartType.TEXT, text: 'foo ', source: undefined },
        { type: PartType.ITALIC, text: 'bar', source: undefined },
        { type: PartType.TEXT, text: ' baz ', source: undefined },
        { type: PartType.CODE, text: ' bam ', source: undefined },
        { type: PartType.TEXT, text: ' ', source: undefined },
        { type: PartType.BOLD, text: ' ( boo ', source: undefined },
        { type: PartType.TEXT, text: ' ) ', source: undefined },
        { type: PartType.URL, url: 'https://example.com/?foo=bar', source: undefined },
        { type: PartType.HORIZONTAL_LINE, source: undefined },
        { type: PartType.LINK, text: 'foo', url: 'https://bar.com', source: undefined },
        { type: PartType.TEXT, text: ' ', source: undefined },
        { type: PartType.RST_REF, text: ' a', ref: 'b ', source: undefined },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz', source: undefined },
        { type: PartType.TEXT, text: 'HORIZONTALLINEx ', source: undefined },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz.bam', source: undefined },
      ],
    ]);
  });
  it('classic markup test (with source)', (): void => {
    expect(
      parse(
        'foo I(bar) baz C( bam ) B( ( boo ) ) U(https://example.com/?foo=bar)HORIZONTALLINE L(foo ,  https://bar.com) R( a , b )M(foo.bar.baz)HORIZONTALLINEx M(foo.bar.baz.bam)',
        { addSource: true },
      ),
    ).toEqual([
      [
        { type: PartType.TEXT, text: 'foo ', source: 'foo ' },
        { type: PartType.ITALIC, text: 'bar', source: 'I(bar)' },
        { type: PartType.TEXT, text: ' baz ', source: ' baz ' },
        { type: PartType.CODE, text: ' bam ', source: 'C( bam )' },
        { type: PartType.TEXT, text: ' ', source: ' ' },
        { type: PartType.BOLD, text: ' ( boo ', source: 'B( ( boo )' },
        { type: PartType.TEXT, text: ' ) ', source: ' ) ' },
        { type: PartType.URL, url: 'https://example.com/?foo=bar', source: 'U(https://example.com/?foo=bar)' },
        { type: PartType.HORIZONTAL_LINE, source: 'HORIZONTALLINE' },
        { type: PartType.LINK, text: 'foo', url: 'https://bar.com', source: 'L(foo ,  https://bar.com)' },
        { type: PartType.TEXT, text: ' ', source: ' ' },
        { type: PartType.RST_REF, text: ' a', ref: 'b ', source: 'R( a , b )' },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz', source: 'M(foo.bar.baz)' },
        { type: PartType.TEXT, text: 'HORIZONTALLINEx ', source: 'HORIZONTALLINEx ' },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz.bam', source: 'M(foo.bar.baz.bam)' },
      ],
    ]);
  });
  it('classic markup test II', (): void => {
    expect(
      parse(
        'foo I(bar) baz C( bam ) B( ( boo ) ) U(https://example.com/?foo=bar)HORIZONTALLINE L(foo ,  https://bar.com) R( a , b )M(foo.bar.baz)HORIZONTALLINEx M(foo.bar.baz.bam)',
        { onlyClassicMarkup: true },
      ),
    ).toEqual([
      [
        { type: PartType.TEXT, text: 'foo ', source: undefined },
        { type: PartType.ITALIC, text: 'bar', source: undefined },
        { type: PartType.TEXT, text: ' baz ', source: undefined },
        { type: PartType.CODE, text: ' bam ', source: undefined },
        { type: PartType.TEXT, text: ' ', source: undefined },
        { type: PartType.BOLD, text: ' ( boo ', source: undefined },
        { type: PartType.TEXT, text: ' ) ', source: undefined },
        { type: PartType.URL, url: 'https://example.com/?foo=bar', source: undefined },
        { type: PartType.HORIZONTAL_LINE, source: undefined },
        { type: PartType.LINK, text: 'foo', url: 'https://bar.com', source: undefined },
        { type: PartType.TEXT, text: ' ', source: undefined },
        { type: PartType.RST_REF, text: ' a', ref: 'b ', source: undefined },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz', source: undefined },
        { type: PartType.TEXT, text: 'HORIZONTALLINEx ', source: undefined },
        { type: PartType.MODULE, fqcn: 'foo.bar.baz.bam', source: undefined },
      ],
    ]);
  });
  it('semantic markup test', (): void => {
    expect(parse('foo E(a\\),b) P(foo.bar.baz#bam) baz V( b\\,\\na\\)\\\\m\\, ) O(foo) ')).toEqual([
      [
        { type: PartType.TEXT, text: 'foo ', source: undefined },
        { type: PartType.ENV_VARIABLE, name: 'a),b', source: undefined },
        { type: PartType.TEXT, text: ' ', source: undefined },
        { type: PartType.PLUGIN, plugin: { fqcn: 'foo.bar.baz', type: 'bam' }, source: undefined },
        { type: PartType.TEXT, text: ' baz ', source: undefined },
        { type: PartType.OPTION_VALUE, value: ' b,na)\\m, ', source: undefined },
        { type: PartType.TEXT, text: ' ', source: undefined },
        {
          type: PartType.OPTION_NAME,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
        { type: PartType.TEXT, text: ' ', source: undefined },
      ],
    ]);
  });
  it('semantic markup test (with source)', (): void => {
    expect(parse('foo E(a\\),b) P(foo.bar.baz#bam) baz V( b\\,\\na\\)\\\\m\\, ) O(foo) ', { addSource: true })).toEqual(
      [
        [
          { type: PartType.TEXT, text: 'foo ', source: 'foo ' },
          { type: PartType.ENV_VARIABLE, name: 'a),b', source: 'E(a\\),b)' },
          { type: PartType.TEXT, text: ' ', source: ' ' },
          { type: PartType.PLUGIN, plugin: { fqcn: 'foo.bar.baz', type: 'bam' }, source: 'P(foo.bar.baz#bam)' },
          { type: PartType.TEXT, text: ' baz ', source: ' baz ' },
          { type: PartType.OPTION_VALUE, value: ' b,na)\\m, ', source: 'V( b\\,\\na\\)\\\\m\\, )' },
          { type: PartType.TEXT, text: ' ', source: ' ' },
          {
            type: PartType.OPTION_NAME,
            plugin: undefined,
            entrypoint: undefined,
            link: ['foo'],
            name: 'foo',
            value: undefined,
            source: 'O(foo)',
          },
          { type: PartType.TEXT, text: ' ', source: ' ' },
        ],
      ],
    );
  });
  it('semantic markup option name', (): void => {
    expect(parse('O(foo)')).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(ignore:foo)', { currentPlugin: { fqcn: 'foo.bar.baz', type: 'bam' } })).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(foo)', { currentPlugin: { fqcn: 'foo.bar.baz', type: 'bam' } })).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: { fqcn: 'foo.bar.baz', type: 'bam' },
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(foo.bar.baz#bam:foo)')).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: { fqcn: 'foo.bar.baz', type: 'bam' },
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(foo=bar)')).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: 'bar',
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(foo.baz=bam)')).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo', 'baz'],
          name: 'foo.baz',
          value: 'bam',
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(foo[1].baz[bam.bar.boing].boo)')).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo', 'baz', 'boo'],
          name: 'foo[1].baz[bam.bar.boing].boo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('O(bar.baz.bam.boo#lookup:foo[1].baz[bam.bar.boing].boo)')).toEqual([
      [
        {
          type: PartType.OPTION_NAME,
          plugin: { fqcn: 'bar.baz.bam.boo', type: 'lookup' },
          entrypoint: undefined,
          link: ['foo', 'baz', 'boo'],
          name: 'foo[1].baz[bam.bar.boing].boo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
  });
  it('semantic markup return value name', (): void => {
    expect(parse('RV(foo)')).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(ignore:foo)', { currentPlugin: { fqcn: 'foo.bar.baz', type: 'bam' } })).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(foo)', { currentPlugin: { fqcn: 'foo.bar.baz', type: 'bam' } })).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: { fqcn: 'foo.bar.baz', type: 'bam' },
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(foo.bar.baz#bam:foo)')).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: { fqcn: 'foo.bar.baz', type: 'bam' },
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(foo=bar)')).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo'],
          name: 'foo',
          value: 'bar',
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(foo.baz=bam)')).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo', 'baz'],
          name: 'foo.baz',
          value: 'bam',
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(foo[1].baz[bam.bar.boing].boo)')).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: undefined,
          entrypoint: undefined,
          link: ['foo', 'baz', 'boo'],
          name: 'foo[1].baz[bam.bar.boing].boo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
    expect(parse('RV(bar.baz.bam.boo#lookup:foo[1].baz[bam.bar.boing].boo)')).toEqual([
      [
        {
          type: PartType.RETURN_VALUE,
          plugin: { fqcn: 'bar.baz.bam.boo', type: 'lookup' },
          entrypoint: undefined,
          link: ['foo', 'baz', 'boo'],
          name: 'foo[1].baz[bam.bar.boing].boo',
          value: undefined,
          source: undefined,
        },
      ],
    ]);
  });
  it('bad parameter parsing (no escaping, throw error)', (): void => {
    expect(async () => parse('M(', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing M() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('M(foo', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing M() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('L(foo)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing L() at index 1: Cannot find comma separating parameter 1 from the next one',
    );
    expect(async () => parse('L(foo,bar', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing L() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('L(foo), bar', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing L() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('P(', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing P() at index 1: Cannot find closing ")" after last parameter',
    );
    expect(async () => parse('P(foo', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing P() at index 1: Cannot find closing ")" after last parameter',
    );
  });
  it('bad module ref (throw error)', (): void => {
    expect(async () => parse('M(foo)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing M() at index 1: Module name "foo" is not a FQCN',
    );
    expect(async () => parse(' M(foo.bar)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing M() at index 2: Module name "foo.bar" is not a FQCN',
    );
    expect(async () => parse('  M(foo. bar.baz)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing M() at index 3: Module name "foo. bar.baz" is not a FQCN',
    );
    expect(async () => parse('   M(foo)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing M() at index 4: Module name "foo" is not a FQCN',
    );
  });
  it('bad plugin ref (throw error)', (): void => {
    expect(async () => parse('P(foo)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing P() at index 1: Parameter "foo" is not of the form FQCN#type',
    );
    expect(async () => parse('P(f o.b r.b z#bar)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing P() at index 1: Plugin name "f o.b r.b z" is not a FQCN',
    );
    expect(async () => parse('P(foo.bar.baz#b m)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing P() at index 1: Plugin type "b m" is not valid',
    );
  });
  it('bad option name/return value (throw error)', (): void => {
    expect(async () =>
      parse('O(f o.b r.b z#bam:foobar)', { errors: 'exception', helpfulErrors: false }),
    ).rejects.toThrow('While parsing O() at index 1: Plugin name "f o.b r.b z" is not a FQCN');
    expect(async () =>
      parse('O(foo.bar.baz#b m:foobar)', { errors: 'exception', helpfulErrors: false }),
    ).rejects.toThrow('While parsing O() at index 1: Plugin type "b m" is not valid');
    expect(async () => parse('O(foo:bar:baz)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing O() at index 1: Invalid option/return value name "foo:bar:baz"',
    );
    expect(async () => parse('O(foo.bar.baz#role:bam)', { errors: 'exception', helpfulErrors: false })).rejects.toThrow(
      'While parsing O() at index 1: Role reference is missing entrypoint',
    );
  });
  it('bad parameter parsing (no escaping, error message)', (): void => {
    expect(parse('M(', { helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('M(foo', { errors: 'message', helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('L(foo)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing L() at index 1: Cannot find comma separating parameter 1 from the next one',
        },
      ],
    ]);
    expect(parse('L(foo,bar', { errors: 'message', helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing L() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('L(foo), bar', { errors: 'message', helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing L() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('P(', { helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing P() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
    expect(parse('P(foo', { errors: 'message', helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing P() at index 1: Cannot find closing ")" after last parameter' }],
    ]);
  });
  it('bad module ref (error message)', (): void => {
    expect(parse('M(foo)', { helpfulErrors: false })).toEqual([
      [{ type: PartType.ERROR, message: 'While parsing M() at index 1: Module name "foo" is not a FQCN' }],
    ]);
    expect(parse(' M(foo.bar)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        { type: PartType.TEXT, text: ' ' },
        { type: PartType.ERROR, message: 'While parsing M() at index 2: Module name "foo.bar" is not a FQCN' },
      ],
    ]);
    expect(parse('  M(foo. bar.baz)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        { type: PartType.TEXT, text: '  ' },
        {
          type: PartType.ERROR,
          message: 'While parsing M() at index 3: Module name "foo. bar.baz" is not a FQCN',
        },
      ],
    ]);
    expect(parse('   M(foo) baz', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        { type: PartType.TEXT, text: '   ' },
        { type: PartType.ERROR, message: 'While parsing M() at index 4: Module name "foo" is not a FQCN' },
        { type: PartType.TEXT, text: ' baz' },
      ],
    ]);
  });
  it('bad plugin ref (error message)', (): void => {
    expect(parse('P(foo)', { helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing P() at index 1: Parameter "foo" is not of the form FQCN#type',
        },
      ],
    ]);
    expect(parse('P(f o.b r.b z#bar)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing P() at index 1: Plugin name "f o.b r.b z" is not a FQCN',
        },
      ],
    ]);
    expect(parse('P(foo.bar.baz#b m)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing P() at index 1: Plugin type "b m" is not valid',
        },
      ],
    ]);
  });
  it('bad option name/return value (error message)', (): void => {
    expect(parse('O(f o.b r.b z#bam:foobar)', { helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing O() at index 1: Plugin name "f o.b r.b z" is not a FQCN',
        },
      ],
    ]);
    expect(parse('O(foo.bar.baz#b m:foobar)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing O() at index 1: Plugin type "b m" is not valid',
        },
      ],
    ]);
    expect(parse('O(foo:bar:baz)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing O() at index 1: Invalid option/return value name "foo:bar:baz"',
        },
      ],
    ]);
    expect(parse('O(foo.bar.baz#role:bam)', { errors: 'message', helpfulErrors: false })).toEqual([
      [
        {
          type: PartType.ERROR,
          message: 'While parsing O() at index 1: Role reference is missing entrypoint',
        },
      ],
    ]);
  });
  it('bad parameter parsing (no escaping, ignore error)', (): void => {
    expect(parse('M(', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('M(foo', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('L(foo)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('L(foo,bar', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('L(foo), bar', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('P(', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('P(foo', { errors: 'ignore' })).toEqual([[]]);
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
  it('bad plugin ref (ignore error)', (): void => {
    expect(parse('P(foo#bar)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('P(f o.b r.b z#bar)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('P(foo.bar.baz#b m)', { errors: 'ignore' })).toEqual([[]]);
  });
  it('bad option name/return value (ignore error)', (): void => {
    expect(parse('O(f o.b r.b z#bam:foobar)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('O(foo.bar.baz#b m:foobar)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('O(foo:bar:baz)', { errors: 'ignore' })).toEqual([[]]);
    expect(parse('O(foo.bar.baz#role:bam)', { errors: 'ignore' })).toEqual([[]]);
  });
});

describe('parser engine', (): void => {
  const commandsA: CommandParser[] = [
    {
      command: 'A',
      parameters: 0,
      process: () => {
        throw Error('boo!');
      },
    },
  ];
  const commandsMapA = composeCommandMap(commandsA);
  const commandsReA = composeCommandRE(commandsA);
  const commandsB: CommandParser[] = [
    {
      command: 'B',
      parameters: 3,
      process: (args) => {
        return {
          type: PartType.TEXT,
          text: `<B:${args.join(':')}>`,
        };
      },
    },
  ];
  const commandsMapB = composeCommandMap(commandsB);
  const commandsReB = composeCommandRE(commandsB);

  it('combine wrong regexp with command map', (): void => {
    expect(async () => parseString('A B()', commandsReA, commandsMapB, {}, '')).rejects.toThrow(
      'Internal error: unknown command "A"',
    );
  });
  it('combine wrong regexp with command map', (): void => {
    expect(parseString('A B()', commandsReA, commandsMapA, { helpfulErrors: false }, '')).toEqual([
      { message: 'While parsing A at index 1: boo!', type: PartType.ERROR },
      { text: ' B()', type: PartType.TEXT },
    ]);
    expect(parseString('A B()', commandsReA, commandsMapA, {}, '')).toEqual([
      { message: 'While parsing "A" at index 1: boo!', type: PartType.ERROR },
      { text: ' B()', type: PartType.TEXT },
    ]);
  });
  it('combine wrong regexp with command map', (): void => {
    expect(parseString('A B(a, b, c)', commandsReB, commandsMapB, {}, '')).toEqual([
      { text: 'A ', type: PartType.TEXT },
      { text: '<B:a:b:c>', type: PartType.TEXT },
    ]);
  });
});
