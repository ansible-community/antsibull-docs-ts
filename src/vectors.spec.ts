/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { readFileSync } from 'fs';

import { parse as parse_yaml } from 'yaml';

import { parse } from './parser';
import { toHTML } from './html';
import { toMD } from './md';
import { toRST } from './rst';

describe('vectors', (): void => {
  const data = readFileSync('test-vectors.yaml', 'utf8');
  const vectors = parse_yaml(data).test_vectors;
  for (const test_name of Object.keys(vectors)) {
    const test_data = vectors[test_name];
    if (test_data.html_opts) {
      if (test_data.html_opts.pluginLink) {
        test_data.html_opts.pluginLink = eval(test_data.html_opts.pluginLink);
      }
    }
    if (test_data.md_opts) {
      if (test_data.md_opts.pluginLink) {
        test_data.md_opts.pluginLink = eval(test_data.md_opts.pluginLink);
      }
    }
    if (test_data.source !== undefined && test_data.html !== undefined) {
      it(`${test_name} (Ansible doc => HTML)`, (): void => {
        expect(toHTML(parse(test_data.source, test_data.parse_opts), test_data.html_opts)).toEqual(test_data.html);
      });
    }
    if (test_data.source !== undefined && test_data.md !== undefined) {
      it(`${test_name} (Ansible doc => MD)`, (): void => {
        expect(toMD(parse(test_data.source, test_data.parse_opts), test_data.md_opts)).toEqual(test_data.md);
      });
    }
    if (test_data.source !== undefined && test_data.rst !== undefined) {
      it(`${test_name} (Ansible doc => RST)`, (): void => {
        expect(toRST(parse(test_data.source, test_data.parse_opts), test_data.rst_opts)).toEqual(test_data.rst);
      });
    }
  }
});
