/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { RSTOptions, AllFormatOptions, mergeOpts } from './opts';
import { OptionNamePart, Paragraph, ReturnValuePart } from './dom';
import { addToDestination } from './format';

export function quoteRST(text: string, escape_starting_whitespace = false, escape_ending_whitespace = false): string {
  text = text.replace(/([\\<>_*`])/g, '\\$1');

  if (escape_ending_whitespace && text.endsWith(' ')) {
    text = text + '\\ ';
  }
  if (escape_starting_whitespace && text.startsWith(' ')) {
    text = '\\ ' + text;
  }
  return text;
}

function formatAntsibullOptionLike(part: OptionNamePart | ReturnValuePart, role: string): string {
  const result: string[] = [];
  if (part.plugin) {
    result.push(part.plugin.fqcn);
    result.push('#');
    result.push(part.plugin.type);
    result.push(':');
  }
  if (part.entrypoint !== undefined) {
    result.push(part.entrypoint);
    result.push(':');
  }
  result.push(part.name);
  if (part.value !== undefined) {
    result.push('=');
    result.push(part.value);
  }
  return `\\ :${role}:\`${quoteRST(result.join(''), true, true)}\`\\ `;
}

function formatPlainOptionLike(part: OptionNamePart | ReturnValuePart): string {
  const plugin: string[] = [];
  if (part.plugin) {
    plugin.push(part.plugin.type);
    if (!['module', 'role', 'playbook'].includes(part.plugin.type)) {
      plugin.push(' plugin');
    }
    plugin.push(
      ` :ref:\`${quoteRST(part.plugin.fqcn)} <ansible_collections.${part.plugin.fqcn}_${part.plugin.type}>\``,
    );
  }
  if (part.entrypoint !== undefined) {
    if (plugin.length) {
      plugin.push(', ');
    }
    plugin.push('entrypoint ');
    plugin.push(quoteRST(part.entrypoint, true));
  }
  let value = part.name;
  if (part.value !== undefined) {
    value = `${value}=${part.value}`;
  }
  const pluginText = plugin.length ? ` (of ${plugin.join('')})` : '';
  const mainText = `:literal:\`${quoteRST(value, true, true)}\``;
  return `\\ ${mainText}${pluginText}\\ `;
}

const DEFAULT_FORMATTER: AllFormatOptions = {
  formatError: (part) => `\\ :strong:\`ERROR while parsing\`\\ : ${quoteRST(part.message, true, true)}\\ `,
  formatBold: (part) => `\\ :strong:\`${quoteRST(part.text, true, true)}\`\\ `,
  formatCode: (part) => `\\ :literal:\`${quoteRST(part.text, true, true)}\`\\ `,
  formatHorizontalLine: () => '\n\n.. raw:: html\n\n  <hr>\n\n',
  formatItalic: (part) => `\\ :emphasis:\`${quoteRST(part.text, true, true)}\`\\ `,
  formatLink: (part) => `\\ \`${quoteRST(part.text)} <${encodeURI(part.url)}>\`__\\ `,
  formatModule: (part) => `\\ :ref:\`${quoteRST(part.fqcn)} <ansible_collections.${part.fqcn}_module>\`\\ `,
  formatRSTRef: (part) => `\\ :ref:\`${quoteRST(part.text)} <${part.ref}>\`\\ `,
  formatURL: (part) => `\\ ${encodeURI(part.url)}\\ `,
  formatText: (part) => quoteRST(part.text),
  formatEnvVariable: (part) => `\\ :envvar:\`${quoteRST(part.name, true, true)}\`\\ `,
  formatOptionName: (part) => formatAntsibullOptionLike(part, 'ansopt'),
  formatOptionValue: (part) => `\\ :ansval:\`${quoteRST(part.value, true, true)}\`\\ `,
  formatPlugin: (part) =>
    `\\ :ref:\`${quoteRST(part.plugin.fqcn)} <ansible_collections.${part.plugin.fqcn}_${part.plugin.type}>\`\\ `,
  formatReturnValue: (part) => formatAntsibullOptionLike(part, 'ansretval'),
};

const PLAIN_FORMATTER: AllFormatOptions = {
  formatError: (part) => `\\ :strong:\`ERROR while parsing\`\\ : ${quoteRST(part.message, true, true)}\\ `,
  formatBold: (part) => `\\ :strong:\`${quoteRST(part.text, true, true)}\`\\ `,
  formatCode: (part) => `\\ :literal:\`${quoteRST(part.text, true, true)}\`\\ `,
  formatHorizontalLine: () => '\n\n------------\n\n',
  formatItalic: (part) => `\\ :emphasis:\`${quoteRST(part.text, true, true)}\`\\ `,
  formatLink: (part) => `\\ \`${quoteRST(part.text)} <${encodeURI(part.url)}>\`__\\ `,
  formatModule: (part) => `\\ :ref:\`${quoteRST(part.fqcn)} <ansible_collections.${part.fqcn}_module>\`\\ `,
  formatRSTRef: (part) => `\\ :ref:\`${quoteRST(part.text)} <${part.ref}>\`\\ `,
  formatURL: (part) => `\\ ${encodeURI(part.url)}\\ `,
  formatText: (part) => quoteRST(part.text),
  formatEnvVariable: (part) => `\\ :envvar:\`${quoteRST(part.name, true, true)}\`\\ `,
  formatOptionName: (part) => formatPlainOptionLike(part),
  formatOptionValue: (part) => `\\ :literal:\`${quoteRST(part.value, true, true)}\`\\ `,
  formatPlugin: (part) =>
    `\\ :ref:\`${quoteRST(part.plugin.fqcn)} <ansible_collections.${part.plugin.fqcn}_${part.plugin.type}>\`\\ `,
  formatReturnValue: (part) => formatPlainOptionLike(part),
};

export function toRST(paragraphs: Paragraph[], opts?: RSTOptions): string {
  opts = opts ?? {};
  const style = opts.style || 'antsibull-docs';
  const mergedOpts = mergeOpts(opts, style === 'antsibull-docs' ? DEFAULT_FORMATTER : PLAIN_FORMATTER);
  const result: string[] = [];
  for (const paragraph of paragraphs) {
    const line: string[] = [];
    addToDestination(line, paragraph, mergedOpts);
    if (!line.length) {
      line.push('\\ ');
    }
    result.push(line.join(''));
  }
  return result.join('\n\n');
}
