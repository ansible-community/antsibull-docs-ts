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
import { toAnsibleDocText } from './ansible-doc-text';

function parseLinkProvider(opts) {
  if (opts['pluginLinkTemplate']) {
    const template = opts['pluginLinkTemplate'];
    opts.pluginLink = (plugin_data) =>
      template
        .replace(/{plugin_fqcn}/g, plugin_data.fqcn)
        .replace(/{plugin_fqcn_slashes}/g, plugin_data.fqcn.replace(/\./g, '/'))
        .replace(/{plugin_type}/g, plugin_data.type);
  }
  if (opts['pluginOptionLikeLinkTemplate']) {
    const template = opts['pluginOptionLikeLinkTemplate'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    opts.pluginOptionLikeLink = (plugin, entrypoint, what, name, current_plugin) =>
      template
        .replace(/{plugin_fqcn}/g, plugin.fqcn)
        .replace(/{plugin_fqcn_slashes}/g, plugin.fqcn.replace(/\./g, '/'))
        .replace(/{plugin_type}/g, plugin.type)
        .replace(/{what}/g, what)
        .replace(/{entrypoint}/g, entrypoint || '')
        .replace(/{entrypoint_with_leading_dash}/g, entrypoint ? '-' + entrypoint : '')
        .replace(/{name_dots}/g, name.join('.'))
        .replace(/{name_slashes}/g, name.join('/'));
  }
}

describe('vectors', (): void => {
  const data = readFileSync('test-vectors.yaml', 'utf8');
  const vectors = parse_yaml(data).test_vectors;
  for (const test_name of Object.keys(vectors)) {
    const test_data = vectors[test_name];
    if (test_data.html_opts) {
      parseLinkProvider(test_data.html_opts);
    }
    if (test_data.md_opts) {
      parseLinkProvider(test_data.md_opts);
    }
    if (test_data.source !== undefined && test_data.html !== undefined) {
      it(`${test_name} (Ansible doc => HTML)`, (): void => {
        expect(toHTML(parse(test_data.source, test_data.parse_opts), test_data.html_opts)).toEqual(test_data.html);
      });
    }
    if (test_data.source !== undefined && test_data.html_plain !== undefined) {
      it(`${test_name} (Ansible doc => plain HTML)`, (): void => {
        expect(
          toHTML(parse(test_data.source, test_data.parse_opts), Object.assign({ style: 'plain' }, test_data.html_opts)),
        ).toEqual(test_data.html_plain);
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
    if (test_data.source !== undefined && test_data.rst_plain !== undefined) {
      it(`${test_name} (Ansible doc => plain RST)`, (): void => {
        expect(
          toRST(parse(test_data.source, test_data.parse_opts), Object.assign({ style: 'plain' }, test_data.rst_opts)),
        ).toEqual(test_data.rst_plain);
      });
    }
    if (test_data.source !== undefined && test_data.ansible_doc_text !== undefined) {
      it(`${test_name} (Ansible doc => ansible-doc text output)`, (): void => {
        expect(
          toAnsibleDocText(parse(test_data.source, test_data.parse_opts), test_data.ansible_doc_text_opts),
        ).toEqual(test_data.ansible_doc_text);
      });
    }
  }
});
