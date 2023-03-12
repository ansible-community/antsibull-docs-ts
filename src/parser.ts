/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { ParsingOptions, PluginIdentifier } from './opts';
import { isFQCN, isPluginType } from './ansible';
import { parseEscapedArgs, parseUnescapedArgs } from './parser-impl';
import {
  PartType,
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
  AnyPart,
  Paragraph,
} from './dom';

const IGNORE_MARKER = 'ignore:';

function parseOptionLike(
  text: string,
  opts: ParsingOptions,
  type: PartType.OPTION_NAME | PartType.RETURN_VALUE,
): OptionNamePart | ReturnValuePart {
  let value: string | undefined;
  const eq = text.indexOf('=');
  if (eq >= 0) {
    value = text.substring(eq + 1, text.length);
    text = text.substring(0, eq);
  }
  const m = /^([^.]+\.[^.]+\.[^#]+)#([^:]+):(.*)$/.exec(text);
  let plugin: PluginIdentifier | undefined;
  if (m) {
    const pluginFqcn = m[1] as string;
    const pluginType = m[2] as string;
    if (!isFQCN(pluginFqcn)) {
      throw Error(`Plugin name "${pluginFqcn}" is not a FQCN`);
    }
    if (!isPluginType(pluginType)) {
      throw Error(`Plugin type "${pluginType}" is not valid`);
    }
    plugin = { fqcn: pluginFqcn, type: pluginType };
    text = m[3] as string;
  } else if (text.startsWith(IGNORE_MARKER)) {
    plugin = undefined;
    text = text.substring(IGNORE_MARKER.length, text.length);
  } else {
    plugin = opts.current_plugin;
  }
  if (/[:#]/.test(text)) {
    throw Error(`Invalid option/return value name "${text}"`);
  }
  return {
    type: type,
    plugin: plugin,
    link: text.replace(/\[([^\]]*)\]/g, '').split('.'),
    name: text,
    value: value,
  };
}

interface CommandParser {
  command: string;
  parameters: number;
  old_markup?: boolean;
  escaped_arguments?: boolean;
  process: (args: string[], opts: ParsingOptions) => AnyPart;
}

const PARSER: CommandParser[] = [
  // Classic Ansible docs markup:
  {
    command: 'I',
    parameters: 1,
    old_markup: true,
    process: (args) => {
      const text = args[0] as string;
      return <ItalicPart>{ type: PartType.ITALIC, text: text };
    },
  },
  {
    command: 'B',
    parameters: 1,
    old_markup: true,
    process: (args) => {
      const text = args[0] as string;
      return <BoldPart>{ type: PartType.BOLD, text: text };
    },
  },
  {
    command: 'M',
    parameters: 1,
    old_markup: true,
    process: (args) => {
      const fqcn = args[0] as string;
      if (!isFQCN(fqcn)) {
        throw Error(`Module name "${fqcn}" is not a FQCN`);
      }
      return <ModulePart>{ type: PartType.MODULE, fqcn: fqcn };
    },
  },
  {
    command: 'U',
    parameters: 1,
    old_markup: true,
    process: (args) => {
      const url = args[0] as string;
      return <URLPart>{ type: PartType.URL, url: url };
    },
  },
  {
    command: 'L',
    parameters: 2,
    old_markup: true,
    process: (args) => {
      const text = args[0] as string;
      const url = args[1] as string;
      return <LinkPart>{ type: PartType.LINK, text: text, url: url };
    },
  },
  {
    command: 'R',
    parameters: 2,
    old_markup: true,
    process: (args) => {
      const text = args[0] as string;
      const ref = args[1] as string;
      return <RSTRefPart>{ type: PartType.RST_REF, text: text, ref: ref };
    },
  },
  {
    command: 'C',
    parameters: 1,
    old_markup: true,
    process: (args) => {
      const text = args[0] as string;
      return <CodePart>{ type: PartType.CODE, text: text };
    },
  },
  {
    command: 'HORIZONTALLINE',
    parameters: 0,
    old_markup: true,
    process: () => {
      return <HorizontalLinePart>{ type: PartType.HORIZONTAL_LINE };
    },
  },
  // Semantic Ansible docs markup:
  {
    command: 'P',
    parameters: 1,
    escaped_arguments: true,
    process: (args) => {
      const m = /^([^).]+\.[^).]+\.[^#]+)#(.+)$/.exec(args[0] as string);
      if (!m) {
        throw Error(`Parameter "${args[0]}" is not of the form FQCN#type`);
      }
      const fqcn = m[1] as string;
      if (!isFQCN(fqcn)) {
        throw Error(`Plugin name "${fqcn}" is not a FQCN`);
      }
      const type = m[2] as string;
      if (!isPluginType(type)) {
        throw Error(`Plugin type "${type}" is not valid`);
      }
      return <PluginPart>{ type: PartType.PLUGIN, plugin: { fqcn: fqcn, type: type } };
    },
  },
  {
    command: 'E',
    parameters: 1,
    escaped_arguments: true,
    process: (args) => {
      const env = args[0] as string;
      return <EnvVariablePart>{ type: PartType.ENV_VARIABLE, name: env };
    },
  },
  {
    command: 'V',
    parameters: 1,
    escaped_arguments: true,
    process: (args) => {
      const value = args[0] as string;
      return <OptionValuePart>{ type: PartType.OPTION_VALUE, value: value };
    },
  },
  {
    command: 'O',
    parameters: 1,
    escaped_arguments: true,
    process: (args, opts) => {
      const value = args[0] as string;
      return parseOptionLike(value, opts, PartType.OPTION_NAME);
    },
  },
  {
    command: 'RV',
    parameters: 1,
    escaped_arguments: true,
    process: (args, opts) => {
      const value = args[0] as string;
      return parseOptionLike(value, opts, PartType.RETURN_VALUE);
    },
  },
];

const PARSER_COMMANDS: Map<string, CommandParser> = (() => {
  const result = new Map<string, CommandParser>();
  PARSER.forEach((cmd) => result.set(cmd.command, cmd));
  return result;
})();

function commandRE(command: CommandParser): string {
  return '\\b' + command.command + (command.parameters === 0 ? '\\b' : '\\(');
}

const COMMAND_RE = new RegExp('(' + PARSER.map(commandRE).join('|') + ')', 'g');
const CLASSIC_COMMAND_RE = new RegExp(
  '(' +
    PARSER.filter((cmd) => cmd.old_markup)
      .map(commandRE)
      .join('|') +
    ')',
  'g',
);

function parseString(input: string, opts: ParsingOptions, where: string): Paragraph {
  const result: AnyPart[] = [];
  const commandRE = opts.only_classic_markup ? CLASSIC_COMMAND_RE : COMMAND_RE;
  const length = input.length;
  let index = 0;
  while (index < length) {
    commandRE.lastIndex = index;
    const match = commandRE.exec(input);
    if (!match) {
      if (index < length) {
        result.push(<TextPart>{
          type: PartType.TEXT,
          text: input.slice(index),
        });
      }
      break;
    }
    if (match.index > index) {
      result.push(<TextPart>{
        type: PartType.TEXT,
        text: input.slice(index, match.index),
      });
    }
    index = match.index;
    let cmd = match[0];
    let endIndex = index + cmd.length;
    if (cmd.endsWith('(')) {
      cmd = cmd.slice(0, cmd.length - 1);
    }
    const command = PARSER_COMMANDS.get(cmd);
    /* istanbul ignore if */
    if (!command) {
      throw Error(`Internal error: unknown command "${cmd}"`);
    }
    let args: string[];
    let error: string | undefined;
    if (command.parameters === 0) {
      args = [];
    } else if (command.escaped_arguments) {
      [args, endIndex, error] = parseEscapedArgs(input, endIndex, command.parameters);
    } else {
      [args, endIndex, error] = parseUnescapedArgs(input, endIndex, command.parameters);
    }
    if (error === undefined) {
      try {
        result.push(command.process(args, opts));
      } catch (exc) {
        error = `${exc}`;
      }
    }
    if (error !== undefined) {
      error = `While parsing ${cmd}${command.parameters > 0 ? '()' : ''} at index ${match.index + 1}${where}: ${error}`;
      switch (opts.errors || 'message') {
        case 'ignore':
          break;
        case 'message':
          result.push(<ErrorPart>{
            type: PartType.ERROR,
            message: error,
          });
          break;
        case 'exception':
          throw Error(error);
      }
    }
    index = endIndex;
  }
  return result;
}

/**
  Parses a string or a list of strings to a list of paragraphs.
 */
export function parse(input: string | string[], opts?: ParsingOptions): Paragraph[] {
  let hasParagraphs = true;
  if (!Array.isArray(input)) {
    input = input ? [input] : [];
    hasParagraphs = false;
  }
  const opts_ = opts || {};
  return input.map((par, index) => parseString('' + par, opts_, hasParagraphs ? ` of paragraph ${index + 1}` : ''));
}
