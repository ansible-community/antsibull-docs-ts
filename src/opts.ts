/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import {
  TextPart,
  ItalicPart,
  BoldPart,
  ModulePart,
  PluginPart,
  URLPart,
  LinkPart,
  RSTRefPart,
  CodePart,
  OptionNamePart,
  OptionValuePart,
  EnvVariablePart,
  ReturnValuePart,
  HorizontalLinePart,
  ErrorPart,
} from './dom';

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

export type Whitespace = 'ignore' | 'strip' | 'keep_single_newlines';

export interface ParsingOptions extends ErrorHandlingOptions {
  /** Should be provided if parsing documentation of a plugin/module/role. */
  currentPlugin?: PluginIdentifier;

  /** Should be provided if parsing documentation of a specific role's entrypoint. */
  roleEntrypoint?: string;

  /** If set to 'true', only 'classic' Ansible docs markup is accepted. */
  onlyClassicMarkup?: boolean;

  /** If set to 'true' (default is 'false'), add source information to every part ('source' attribute). */
  addSource?: boolean;

  /** If set to 'true' (default is 'true'), include the faulty markup in error messages. */
  helpfulErrors?: boolean;

  /**
    How to handle whitespace (default is 'ignore').

    'ignore': Keep all whitespace as-is.

    'strip': Reduce all whitespace (space, tabs, newlines, ...) to regular breakable or
    non-breakable spaces. Multiple spaces are kept in everything that's often rendered
    code-style, like C(), O(), V(), RV(), E().

    'keep_single_newlines': Similar to 'strip', but keep single newlines intact.
  */
  whitespace?: Whitespace;
}

export interface CommonExportOptions extends ErrorHandlingOptions {
  /** Should be provided if rendering documentation for a plugin/module/role. */
  currentPlugin?: PluginIdentifier;
}

interface CommonFormatOptions {
  formatError?: (part: ErrorPart) => string;
  formatBold?: (part: BoldPart) => string;
  formatCode?: (part: CodePart) => string;
  formatHorizontalLine?: (part: HorizontalLinePart) => string;
  formatItalic?: (part: ItalicPart) => string;
  formatLink?: (part: LinkPart) => string;
  formatModule?: (part: ModulePart, url: string | undefined) => string;
  formatRSTRef?: (part: RSTRefPart) => string;
  formatURL?: (part: URLPart) => string;
  formatText?: (part: TextPart) => string;
  formatEnvVariable?: (part: EnvVariablePart) => string;
  formatOptionName?: (part: OptionNamePart) => string;
  formatOptionValue?: (part: OptionValuePart) => string;
  formatPlugin?: (part: PluginPart) => string;
  formatReturnValue?: (part: ReturnValuePart) => string;
}

export interface AllFormatOptions {
  formatError: (part: ErrorPart) => string;
  formatBold: (part: BoldPart) => string;
  formatCode: (part: CodePart) => string;
  formatHorizontalLine: (part: HorizontalLinePart) => string;
  formatItalic: (part: ItalicPart) => string;
  formatLink: (part: LinkPart) => string;
  formatModule: (part: ModulePart, url: string | undefined) => string;
  formatRSTRef: (part: RSTRefPart) => string;
  formatURL: (part: URLPart) => string;
  formatText: (part: TextPart) => string;
  formatEnvVariable: (part: EnvVariablePart) => string;
  formatOptionName: (part: OptionNamePart, url: string | undefined) => string;
  formatOptionValue: (part: OptionValuePart) => string;
  formatPlugin: (part: PluginPart, url: string | undefined) => string;
  formatReturnValue: (part: ReturnValuePart, url: string | undefined) => string;
}

export interface LinkProviders {
  /** Provides a link to a plugin. */
  pluginLink?: (plugin: PluginIdentifier) => string | undefined;

  /** Provides a link to a plugin's option or return value. */
  pluginOptionLikeLink?: (
    plugin: PluginIdentifier,
    entrypoint: string | undefined,
    what: 'option' | 'retval',
    name: string[],
    currentPlugin: boolean,
  ) => string | undefined;
}

export interface HTMLOptions extends CommonExportOptions, CommonFormatOptions, LinkProviders {
  /** Whether the HTML should be formatted as in antsibull-docs (for use with Sphinx) or with plain HTML. Default: 'antsibull-docs'. */
  style?: 'antsibull-docs' | 'plain';

  /** String to start a new paragraph with. Default: `<p>`. */
  parStart?: string;

  /** String to end a new paragraph with. Default: `</p>`. */
  parEnd?: string;
}

export interface MDOptions extends CommonExportOptions, CommonFormatOptions, LinkProviders {}

export interface RSTOptions extends CommonExportOptions, CommonFormatOptions {
  /** Whether the RST should be formatted as in antsibull-docs (for use with Sphinx and the
      sphinx_antsibull_ext extension) or with plain RST. Default: 'antsibull-docs'. */
  style?: 'antsibull-docs' | 'plain';
}

export interface AnsibleDocTextOptions extends CommonExportOptions, CommonFormatOptions {}

export function mergeOpts<T extends CommonFormatOptions>(options: T, fallback: AllFormatOptions): T & AllFormatOptions {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const result: any = Object.assign({}, fallback, options);
  // In case options.formatXXX is explicitly set to undefined:
  for (const key of Object.keys(fallback)) {
    if (!result[key]) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      result[key] = (fallback as any)[key];
    }
  }
  return result as T & AllFormatOptions;
}
