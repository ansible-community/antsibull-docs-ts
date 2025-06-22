/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { ParsingOptions, PluginIdentifier, Whitespace } from './opts';
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

function repr(text: string): string {
  return JSON.stringify(text);
}

const IGNORE_MARKER = 'ignore:';

function parseOptionLike(
  text: string,
  opts: ParsingOptions,
  type: PartType.OPTION_NAME | PartType.RETURN_VALUE,
  source: string | undefined,
): OptionNamePart | ReturnValuePart {
  let value: string | undefined;
  const eq = text.indexOf('=');
  if (eq >= 0) {
    value = text.substring(eq + 1, text.length);
    text = text.substring(0, eq);
  }
  const m = /^([^.]+\.[^.]+\.[^#]+)#([^:]+):(.*)$/.exec(text);
  let plugin: PluginIdentifier | undefined;
  let entrypoint: string | undefined;
  if (m) {
    const pluginFqcn = m[1] as string;
    const pluginType = m[2] as string;
    if (!isFQCN(pluginFqcn)) {
      throw Error(`Plugin name ${repr(pluginFqcn)} is not a FQCN`);
    }
    if (!isPluginType(pluginType)) {
      throw Error(`Plugin type ${repr(pluginType)} is not valid`);
    }
    plugin = { fqcn: pluginFqcn, type: pluginType };
    text = m[3] as string;
  } else if (text.startsWith(IGNORE_MARKER)) {
    plugin = undefined;
    text = text.substring(IGNORE_MARKER.length, text.length);
  } else {
    plugin = opts.currentPlugin;
    entrypoint = opts.roleEntrypoint;
  }
  if (plugin?.type === 'role') {
    const idx = text.indexOf(':');
    if (idx >= 0) {
      entrypoint = text.substr(0, idx);
      text = text.substr(idx + 1);
    }
    if (entrypoint === undefined) {
      throw Error('Role reference is missing entrypoint');
    }
  }
  if (/[:#]/.test(text)) {
    throw Error(`Invalid option/return value name ${repr(text)}`);
  }
  return {
    type: type,
    plugin: plugin,
    entrypoint: entrypoint,
    link: text.replace(/\[([^\]]*)\]/g, '').split('.'),
    name: text,
    value: value,
    source: source,
  };
}

function addWhitespace(result: string[], ws: string, whitespace: Whitespace, noNewlines: boolean): void {
  if (whitespace === 'keep_single_newlines' && !noNewlines && ws.search(/[\n\r]/) >= 0) {
    result.push('\n');
  } else {
    result.push(' ');
  }
}

export function processWhitespace(
  text: string,
  whitespace: Whitespace,
  codeEnvironment: boolean,
  noNewlines: boolean,
): string {
  if (whitespace === 'ignore') {
    return text;
  }
  const length = text.length;
  let index = 0;
  const result: string[] = [];
  const whitespaces = /([\s]+)/g;
  // The 'no-misleading-character-class' warning reported by eslint below can be safely
  // ignored since we have a list of distinct Unicode codepoints, and we don't rely on
  // them being part of the adjacent codepoints.
  /* eslint-disable-next-line no-misleading-character-class */
  const spacesToKeep = /([\u00A0\u202F\u2007\u2060\u200B\u200C\u200D\uFEFF]+)/g;
  while (index < length) {
    whitespaces.lastIndex = index;
    const m = whitespaces.exec(text);
    if (!m) {
      result.push(text.slice(index));
      break;
    }
    if (m.index > index) {
      result.push(text.slice(index, m.index));
    }
    const ws = m[0];
    const ws_length = ws.length;
    if (codeEnvironment) {
      result.push(ws.replace(/[\t\n\r]/g, ' '));
    } else {
      let ws_index = 0;
      while (ws_index < ws_length) {
        spacesToKeep.lastIndex = ws_index;
        const wsm = spacesToKeep.exec(ws);
        if (!wsm) {
          addWhitespace(result, ws.slice(ws_index), whitespace, noNewlines);
          break;
        }
        if (wsm.index > ws_index) {
          addWhitespace(result, ws.slice(ws_index, wsm.index), whitespace, noNewlines);
        }
        result.push(wsm[0]);
        ws_index = wsm.index + wsm[0].length;
      }
    }
    index = m.index + ws_length;
  }
  return result.join('');
}

export interface CommandParser {
  command: string;
  parameters: number;
  escapedArguments?: boolean;
  stripSurroundingWhitespace?: boolean;
  process: (args: string[], opts: ParsingOptions, source: string | undefined, whitespace: Whitespace) => AnyPart;
}

interface CommandParserEx extends CommandParser {
  old_markup?: boolean;
}

const PARSER: CommandParserEx[] = [
  // Classic Ansible docs markup:
  {
    command: 'I',
    parameters: 1,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const text = processWhitespace(args[0] as string, whitespace, false, true);
      return <ItalicPart>{ type: PartType.ITALIC, text: text, source: source };
    },
  },
  {
    command: 'B',
    parameters: 1,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const text = processWhitespace(args[0] as string, whitespace, false, true);
      return <BoldPart>{ type: PartType.BOLD, text: text, source: source };
    },
  },
  {
    command: 'M',
    parameters: 1,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const fqcn = processWhitespace(args[0] as string, whitespace, false, true);
      if (!isFQCN(fqcn)) {
        throw Error(`Module name ${repr(fqcn)} is not a FQCN`);
      }
      return <ModulePart>{ type: PartType.MODULE, fqcn: fqcn, source: source };
    },
  },
  {
    command: 'U',
    parameters: 1,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const url = processWhitespace(args[0] as string, whitespace, false, true);
      return <URLPart>{ type: PartType.URL, url: url, source: source };
    },
  },
  {
    command: 'L',
    parameters: 2,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const text = processWhitespace(args[0] as string, whitespace, false, true);
      const url = processWhitespace(args[1] as string, whitespace, false, true);
      return <LinkPart>{ type: PartType.LINK, text: text, url: url, source: source };
    },
  },
  {
    command: 'R',
    parameters: 2,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const text = processWhitespace(args[0] as string, whitespace, false, true);
      const ref = processWhitespace(args[1] as string, whitespace, false, true);
      return <RSTRefPart>{ type: PartType.RST_REF, text: text, ref: ref, source: source };
    },
  },
  {
    command: 'C',
    parameters: 1,
    old_markup: true,
    process: (args, _, source, whitespace) => {
      const text = processWhitespace(args[0] as string, whitespace, true, true);
      return <CodePart>{ type: PartType.CODE, text: text, source: source };
    },
  },
  {
    command: 'HORIZONTALLINE',
    parameters: 0,
    stripSurroundingWhitespace: true,
    old_markup: true,
    process: (_, __, source) => {
      return <HorizontalLinePart>{ type: PartType.HORIZONTAL_LINE, source: source };
    },
  },
  // Semantic Ansible docs markup:
  {
    command: 'P',
    parameters: 1,
    escapedArguments: true,
    process: (args, _, source, whitespace) => {
      const plugin = processWhitespace(args[0] as string, whitespace, false, true);
      const m = /^([^#]*)#(.*)$/.exec(plugin);
      if (!m) {
        throw Error(`Parameter ${repr(args[0] as string)} is not of the form FQCN#type`);
      }
      const fqcn = m[1] as string;
      if (!isFQCN(fqcn)) {
        throw Error(`Plugin name ${repr(fqcn)} is not a FQCN`);
      }
      const type = m[2] as string;
      if (!isPluginType(type)) {
        throw Error(`Plugin type ${repr(type)} is not valid`);
      }
      return <PluginPart>{ type: PartType.PLUGIN, plugin: { fqcn: fqcn, type: type }, source: source };
    },
  },
  {
    command: 'E',
    parameters: 1,
    escapedArguments: true,
    process: (args, _, source, whitespace) => {
      const env = processWhitespace(args[0] as string, whitespace, true, true);
      return <EnvVariablePart>{ type: PartType.ENV_VARIABLE, name: env, source: source };
    },
  },
  {
    command: 'V',
    parameters: 1,
    escapedArguments: true,
    process: (args, _, source, whitespace) => {
      const value = processWhitespace(args[0] as string, whitespace, true, true);
      return <OptionValuePart>{ type: PartType.OPTION_VALUE, value: value, source: source };
    },
  },
  {
    command: 'O',
    parameters: 1,
    escapedArguments: true,
    process: (args, opts, source, whitespace) => {
      const value = processWhitespace(args[0] as string, whitespace, true, true);
      return parseOptionLike(value, opts, PartType.OPTION_NAME, source);
    },
  },
  {
    command: 'RV',
    parameters: 1,
    escapedArguments: true,
    process: (args, opts, source, whitespace) => {
      const value = processWhitespace(args[0] as string, whitespace, true, true);
      return parseOptionLike(value, opts, PartType.RETURN_VALUE, source);
    },
  },
];

export function composeCommandMap(commands: CommandParser[]): Map<string, CommandParser> {
  const result = new Map<string, CommandParser>();
  commands.forEach((cmd) => result.set(cmd.command, cmd));
  return result;
}

function commandRE(command: CommandParser): string {
  return '\\b' + command.command + (command.parameters === 0 ? '\\b' : '\\(');
}

export function composeCommandRE(commands: CommandParser[]): RegExp {
  return new RegExp('(' + commands.map(commandRE).join('|') + ')', 'g');
}

const PARSER_COMMANDS: Map<string, CommandParser> = composeCommandMap(PARSER);
const COMMAND_RE = composeCommandRE(PARSER);
const CLASSIC_COMMAND_RE = composeCommandRE(PARSER.filter((cmd) => cmd.old_markup));

export function parseString(
  input: string,
  commandRE: RegExp,
  commands: Map<string, CommandParser>,
  opts: ParsingOptions,
  where: string,
): Paragraph {
  // TODO: handle opts.whitespace!
  const result: AnyPart[] = [];
  const whitespace = opts.whitespace || 'ignore';
  const length = input.length;
  let index = 0;
  while (index < length) {
    commandRE.lastIndex = index;
    const match = commandRE.exec(input);
    if (!match) {
      if (index < length) {
        const text = input.slice(index);
        result.push(<TextPart>{
          type: PartType.TEXT,
          text: processWhitespace(text, whitespace, false, false),
          source: opts.addSource ? text : undefined,
        });
      }
      break;
    }
    const prevIndex = index;
    index = match.index;
    let cmd = match[0];
    let endIndex = index + cmd.length;
    if (cmd.endsWith('(')) {
      cmd = cmd.slice(0, cmd.length - 1);
    }
    const command = commands.get(cmd);
    if (!command) {
      throw Error(`Internal error: unknown command ${repr(cmd)}`);
    }
    if (match.index > prevIndex) {
      let text = input.slice(prevIndex, match.index);
      if (command.stripSurroundingWhitespace) {
        let end = text.length;
        while (end > 0 && /[ \t]/.test(text[end - 1] as string)) {
          end -= 1;
        }
        if (end < text.length) {
          text = text.slice(0, end);
        }
      }
      result.push(<TextPart>{
        type: PartType.TEXT,
        text: processWhitespace(text, whitespace, false, false),
        source: opts.addSource ? text : undefined,
      });
    }
    let args: string[];
    let error: string | undefined;
    if (command.parameters === 0) {
      args = [];
    } else if (command.escapedArguments) {
      [args, endIndex, error] = parseEscapedArgs(input, endIndex, command.parameters);
    } else {
      [args, endIndex, error] = parseUnescapedArgs(input, endIndex, command.parameters);
    }
    const source = opts.addSource ? input.slice(index, endIndex) : undefined;
    if (error === undefined) {
      try {
        result.push(command.process(args, opts, source, whitespace));
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      } catch (exc: any) {
        error = `${exc}`;
        if (exc?.message !== undefined) {
          error = `${exc.message}`;
        }
      }
    }
    if (error !== undefined) {
      const errorSource =
        (opts.helpfulErrors ?? true)
          ? repr(input.slice(index, endIndex))
          : `${cmd}${command.parameters > 0 ? '()' : ''}`;
      error = `While parsing ${errorSource} at index ${match.index + 1}${where}: ${error}`;
      switch (opts.errors || 'message') {
        case 'ignore':
          break;
        case 'message':
          result.push(<ErrorPart>{
            type: PartType.ERROR,
            message: error,
            source: source,
          });
          break;
        case 'exception':
          throw Error(error);
      }
    }
    index = endIndex;
    if (command.stripSurroundingWhitespace) {
      while (index < length && /[ \t]/.test(input[index] as string)) {
        index += 1;
      }
    }
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
  const commandRE = opts_.onlyClassicMarkup ? CLASSIC_COMMAND_RE : COMMAND_RE;
  return input.map((par, index) =>
    parseString('' + par, commandRE, PARSER_COMMANDS, opts_, hasParagraphs ? ` of paragraph ${index + 1}` : ''),
  );
}
