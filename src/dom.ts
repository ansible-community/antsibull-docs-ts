/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { PluginIdentifier } from './opts';

export enum PartType {
  ERROR = 0,
  BOLD = 1,
  CODE = 2,
  HORIZONTAL_LINE = 3,
  ITALIC = 4,
  LINK = 5,
  MODULE = 6,
  RST_REF = 7,
  URL = 8,
  TEXT = 9,
  ENV_VARIABLE = 10,
  OPTION_NAME = 11,
  OPTION_VALUE = 12,
  PLUGIN = 13,
  RETURN_VALUE = 14,
}

export interface Part {
  type: PartType;
  source: string | undefined;
}

export interface TextPart extends Part {
  type: PartType.TEXT;
  text: string;
}

export interface ItalicPart extends Part {
  type: PartType.ITALIC;
  text: string;
}

export interface BoldPart extends Part {
  type: PartType.BOLD;
  text: string;
}

export interface ModulePart extends Part {
  type: PartType.MODULE;
  fqcn: string;
}

export interface PluginPart extends Part {
  type: PartType.PLUGIN;
  plugin: PluginIdentifier;
}

export interface URLPart extends Part {
  type: PartType.URL;
  url: string;
}

export interface LinkPart extends Part {
  type: PartType.LINK;
  text: string;
  url: string;
}

export interface RSTRefPart extends Part {
  type: PartType.RST_REF;
  text: string;
  ref: string;
}

export interface CodePart extends Part {
  type: PartType.CODE;
  text: string;
}

export interface OptionNamePart extends Part {
  type: PartType.OPTION_NAME;
  plugin: PluginIdentifier | undefined;
  entrypoint: string | undefined; // provided iff plugin.type == 'role'
  link: string[];
  name: string;
  value: string | undefined;
}

export interface OptionValuePart extends Part {
  type: PartType.OPTION_VALUE;
  value: string;
}

export interface EnvVariablePart extends Part {
  type: PartType.ENV_VARIABLE;
  name: string;
}

export interface ReturnValuePart extends Part {
  type: PartType.RETURN_VALUE;
  plugin: PluginIdentifier | undefined;
  entrypoint: string | undefined; // provided iff plugin.type == 'role'
  link: string[];
  name: string;
  value: string | undefined;
}

export interface HorizontalLinePart extends Part {
  type: PartType.HORIZONTAL_LINE;
}

export interface ErrorPart extends Part {
  type: PartType.ERROR;
  message: string;
}

export type AnyPart =
  | TextPart
  | ItalicPart
  | BoldPart
  | ModulePart
  | PluginPart
  | URLPart
  | LinkPart
  | RSTRefPart
  | CodePart
  | OptionNamePart
  | OptionValuePart
  | EnvVariablePart
  | ReturnValuePart
  | HorizontalLinePart
  | ErrorPart;

export type Paragraph = AnyPart[];
