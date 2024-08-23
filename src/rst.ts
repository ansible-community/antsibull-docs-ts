/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { RSTOptions, AllFormatOptions, mergeOpts } from './opts';
import { OptionNamePart, Paragraph, ReturnValuePart } from './dom';
import { addToDestination } from './format';
import { splitLines, startsWith, endsWith } from './util';

export function quoteRST(
  text: string,
  escape_starting_whitespace = false,
  escape_ending_whitespace = false,
  must_not_be_empty = false,
): string {
  text = text.replace(/([\\<>_*`])/g, '\\$1');

  if (escape_ending_whitespace && /\s$/.test(text.substring(text.length - 1))) {
    text = text + '\\ ';
  }
  if (escape_starting_whitespace && /^\s/.test(text)) {
    text = '\\ ' + text;
  }
  if (must_not_be_empty && text === '') {
    text = '\\ ';
  }
  return text;
}

function removeBackslashSpace(line: string): string {
  let start = 0;
  let end = line.length;

  while (true) {
    // Remove starting '\ '. These have no effect.
    while (startsWith(line, '\\ ', start, end)) {
      start += 2;
    }

    // If the line now starts with regular whitespace, trim it.
    if (startsWith(line, ' ', start, end)) {
      start += 1;
    } else {
      // If there is none, we're done.
      break;
    }

    // Remove more starting whitespace, and then check again for leading '\ ' etc.
    while (startsWith(line, ' ', start, end)) {
      start += 1;
    }
  }

  while (true) {
    /*
    Remove trailing '\ ' resp. '\' (after line.trim()). These actually have an effect,
    since they remove the linebreak. *But* if our markup generator emits '\ ' followed
    by a line break, we still want the line break to count, so this is actually fixing
    a bug.
    */
    if (endsWith(line, '\\', start, end)) {
      end -= 1;
    }
    while (endsWith(line, '\\ ', start, end)) {
      end -= 2;
    }

    // If the line now ends with regular whitespace, trim it.
    if (endsWith(line, ' ', start, end)) {
      end -= 1;
    } else {
      // If there is none, we're done.
      break;
    }

    // Remove more ending whitespace, and then check again for trailing '\' etc.
    while (endsWith(line, ' ', start, end)) {
      end -= 1;
    }
  }

  // Return subset of the line
  line = line.substring(start, end);
  line = line.replace(/\\ (?:\\ )+/g, '\\ ');
  line = line.replace(/(?<![\\])([ ])\\ (?![`])/g, '$1');
  line = line.replace(/(?<!:`)\\ ([ .])/g, '$1');
  return line;
}

function checkLine(index: number, lines: string[], line: string): boolean {
  if (index < 0 || index >= lines.length) {
    return false;
  }
  return lines[index] === line;
}

function modifyLine(index: number, line: string, lines: string[]): boolean {
  const raw_html = '.. raw:: html';
  const dashes = '------------';
  const hr = '  <hr>';
  if (line !== '' && line !== raw_html && line !== dashes && line !== hr) {
    return true;
  }
  if (line === raw_html || line === dashes) {
    return false;
  }
  if (line === hr && checkLine(index - 2, lines, raw_html)) {
    return false;
  }
  if (
    line === '' &&
    (checkLine(index + 1, lines, raw_html) ||
      checkLine(index - 1, lines, raw_html) ||
      checkLine(index - 3, lines, raw_html))
  ) {
    return false;
  }
  if (line === '' && (checkLine(index + 1, lines, dashes) || checkLine(index - 1, lines, dashes))) {
    return false;
  }
  return true;
}

export function postprocessRSTParagraph(par: string): string {
  let lines = splitLines(par.trim());
  lines = lines.map((line, index) =>
    modifyLine(index, line, lines) ? removeBackslashSpace(line.trim().replace('\t', ' ')) : line,
  );
  return lines.filter((line, index) => (modifyLine(index, line, lines) ? !!line : true)).join('\n');
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
  return `\\ :${role}:\`${quoteRST(result.join(''), true, true, true)}\`\\ `;
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
  const mainText = `:literal:\`${quoteRST(value, true, true, true)}\``;
  return `\\ ${mainText}${pluginText}\\ `;
}

const DEFAULT_FORMATTER: AllFormatOptions = {
  formatError: (part) => `\\ :strong:\`ERROR while parsing\`\\ : ${quoteRST(part.message, true, true, true)}\\ `,
  formatBold: (part) => `\\ :strong:\`${quoteRST(part.text, true, true, true)}\`\\ `,
  formatCode: (part) => `\\ :literal:\`${quoteRST(part.text, true, true, true)}\`\\ `,
  formatHorizontalLine: () => '\n\n.. raw:: html\n\n  <hr>\n\n',
  formatItalic: (part) => `\\ :emphasis:\`${quoteRST(part.text, true, true, true)}\`\\ `,
  formatLink: (part) =>
    part.text === ''
      ? ''
      : part.url === ''
        ? quoteRST(part.text)
        : `\\ \`${quoteRST(part.text)} <${encodeURI(part.url)}>\`__\\ `,
  formatModule: (part) =>
    `\\ :ref:\`${quoteRST(part.fqcn, true, true, true)} <ansible_collections.${part.fqcn}_module>\`\\ `,
  formatRSTRef: (part) => `\\ :ref:\`${quoteRST(part.text, true, true, true)} <${part.ref}>\`\\ `,
  formatURL: (part) => (part.url === '' ? '' : `\\ \`${quoteRST(part.url)} <${encodeURI(part.url)}>\`__\\ `),
  formatText: (part) => quoteRST(part.text),
  formatEnvVariable: (part) => `\\ :envvar:\`${quoteRST(part.name, true, true, true)}\`\\ `,
  formatOptionName: (part) => formatAntsibullOptionLike(part, 'ansopt'),
  formatOptionValue: (part) => `\\ :ansval:\`${quoteRST(part.value, true, true, true)}\`\\ `,
  formatPlugin: (part) =>
    `\\ :ref:\`${quoteRST(part.plugin.fqcn)} <ansible_collections.${part.plugin.fqcn}_${part.plugin.type}>\`\\ `,
  formatReturnValue: (part) => formatAntsibullOptionLike(part, 'ansretval'),
};

const PLAIN_FORMATTER: AllFormatOptions = {
  formatError: (part) => `\\ :strong:\`ERROR while parsing\`\\ : ${quoteRST(part.message, true, true, true)}\\ `,
  formatBold: (part) => `\\ :strong:\`${quoteRST(part.text, true, true, true)}\`\\ `,
  formatCode: (part) => `\\ :literal:\`${quoteRST(part.text, true, true, true)}\`\\ `,
  formatHorizontalLine: () => '\n\n------------\n\n',
  formatItalic: (part) => `\\ :emphasis:\`${quoteRST(part.text, true, true, true)}\`\\ `,
  formatLink: (part) =>
    part.text === ''
      ? ''
      : part.url === ''
        ? quoteRST(part.text)
        : `\\ \`${quoteRST(part.text)} <${encodeURI(part.url)}>\`__\\ `,
  formatModule: (part) =>
    `\\ :ref:\`${quoteRST(part.fqcn, true, true, true)} <ansible_collections.${part.fqcn}_module>\`\\ `,
  formatRSTRef: (part) => `\\ :ref:\`${quoteRST(part.text, true, true, true)} <${part.ref}>\`\\ `,
  formatURL: (part) => (part.url === '' ? '' : `\\ \`${quoteRST(part.url)} <${encodeURI(part.url)}>\`__\\ `),
  formatText: (part) => quoteRST(part.text),
  formatEnvVariable: (part) => `\\ :envvar:\`${quoteRST(part.name, true, true, true)}\`\\ `,
  formatOptionName: (part) => formatPlainOptionLike(part),
  formatOptionValue: (part) => `\\ :literal:\`${quoteRST(part.value, true, true, true)}\`\\ `,
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
    const lineStr = postprocessRSTParagraph(line.join(''));
    result.push(lineStr || '\\');
  }
  return result.join('\n\n');
}
