/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { AnsibleDocTextOptions, AllFormatOptions, mergeOpts, LinkProviders } from './opts';
import { OptionNamePart, Paragraph, ReturnValuePart } from './dom';
import { addToDestination } from './format';

function formatOptionLike(part: OptionNamePart | ReturnValuePart): string {
  let text = part.value === undefined ? `\`${part.name}'` : `\`${part.name}=${part.value}'`;
  if (part.plugin) {
    const plugin_suffix = ['role', 'module', 'playbook'].includes(part.plugin.type) ? '' : ' plugin';
    let plugin = `${part.plugin.type}${plugin_suffix} ${part.plugin.fqcn}`;
    if (part.plugin.type === 'role' && part.entrypoint !== undefined) {
      plugin = `${plugin}, ${part.entrypoint} entrypoint`;
    }
    text = `${text} (of ${plugin})`;
  }
  return text;
}

const DEFAULT_FORMATTER: AllFormatOptions = {
  formatError: (part) => `[[ERROR while parsing: ${part.message}]]`,
  formatBold: (part) => `*${part.text}*`,
  formatCode: (part) => `\`${part.text}'`,
  formatHorizontalLine: () => '\n-------------\n',
  formatItalic: (part) => `\`${part.text}'`,
  formatLink: (part) => `${part.text} <${part.url}>`,
  formatModule: (part) => `[${part.fqcn}]`,
  formatRSTRef: (part) => part.text,
  formatURL: (part) => part.url,
  formatText: (part) => part.text,
  formatEnvVariable: (part) => `\`${part.name}'`,
  formatOptionName: (part) => formatOptionLike(part),
  formatOptionValue: (part) => `\`${part.value}'`,
  formatPlugin: (part) => `[${part.plugin.fqcn}]`,
  formatReturnValue: (part) => formatOptionLike(part),
};

export function toAnsibleDocText(paragraphs: Paragraph[], opts?: AnsibleDocTextOptions): string {
  const mergedOpts = mergeOpts(Object.assign({} as LinkProviders, opts), DEFAULT_FORMATTER);
  const result: string[] = [];
  for (const paragraph of paragraphs) {
    const line: string[] = [];
    addToDestination(line, paragraph, mergedOpts);
    result.push(line.join(''));
  }
  return result.join('\n\n');
}
