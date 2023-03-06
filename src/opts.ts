/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

interface ErrorHandlingOptions {
  /**
    Controls how errors are handled:
    * 'ignore' simply ignores the faulty element;
    * 'message' produces an error message in the output;
    * 'exception' throws an error.

    The default is 'message'.
  */
  errors?: 'ignore' | 'message' | 'exception';
}

export interface PluginIdentifier {
  fqcn: string;
  type: string;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ParsingOptions extends ErrorHandlingOptions {
  /** Should be provided if parsing documentation of a plugin/module/role. */
  current_plugin?: PluginIdentifier;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
interface CommonExportOptions extends ErrorHandlingOptions {
  /** Should be provided if rendering documentation for a plugin/module/role. */
  current_plugin?: PluginIdentifier;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface HTMLOptions extends CommonExportOptions {
  /** Provides a link to a plugin. */
  pluginLink?: (plugin: PluginIdentifier) => string | undefined;
}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface RSTOptions extends CommonExportOptions {}
