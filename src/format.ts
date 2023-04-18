/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { AllFormatOptions, CommonExportOptions, LinkProviders } from './opts';
import { PartType, Paragraph } from './dom';

export function addToDestination(
  destination: string[],
  paragraph: Paragraph,
  opts: AllFormatOptions & LinkProviders & CommonExportOptions,
): void {
  for (const part of paragraph) {
    switch (part.type) {
      case PartType.ERROR:
        destination.push(opts.formatError(part));
        break;
      case PartType.BOLD:
        destination.push(opts.formatBold(part));
        break;
      case PartType.CODE:
        destination.push(opts.formatCode(part));
        break;
      case PartType.HORIZONTAL_LINE:
        destination.push(opts.formatHorizontalLine(part));
        break;
      case PartType.ITALIC:
        destination.push(opts.formatItalic(part));
        break;
      case PartType.LINK:
        destination.push(opts.formatLink(part));
        break;
      case PartType.MODULE: {
        let url: string | undefined;
        if (opts.pluginLink) {
          url = opts.pluginLink({ fqcn: part.fqcn, type: 'module' });
        }
        destination.push(opts.formatModule(part, url));
        break;
      }
      case PartType.RST_REF:
        destination.push(opts.formatRSTRef(part));
        break;
      case PartType.URL:
        destination.push(opts.formatURL(part));
        break;
      case PartType.TEXT:
        destination.push(opts.formatText(part));
        break;
      case PartType.ENV_VARIABLE:
        destination.push(opts.formatEnvVariable(part));
        break;
      case PartType.OPTION_NAME: {
        let url: string | undefined;
        if (part.plugin && opts.pluginOptionLikeLink) {
          url = opts.pluginOptionLikeLink(
            part.plugin,
            part.entrypoint,
            'option',
            part.link,
            part.plugin === opts.currentPlugin,
          );
        }
        destination.push(opts.formatOptionName(part, url));
        break;
      }
      case PartType.OPTION_VALUE:
        destination.push(opts.formatOptionValue(part));
        break;
      case PartType.PLUGIN: {
        let url: string | undefined;
        if (opts.pluginLink) {
          url = opts.pluginLink(part.plugin);
        }
        destination.push(opts.formatPlugin(part, url));
        break;
      }
      case PartType.RETURN_VALUE: {
        let url: string | undefined;
        if (part.plugin && opts.pluginOptionLikeLink) {
          url = opts.pluginOptionLikeLink(
            part.plugin,
            part.entrypoint,
            'retval',
            part.link,
            part.plugin === opts.currentPlugin,
          );
        }
        destination.push(opts.formatReturnValue(part, url));
        break;
      }
    }
  }
}
