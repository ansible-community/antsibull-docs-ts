/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

import { ParsingOptions } from './opts';
import { isFQCN } from './ansible';

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
}

export interface Part {
  type: PartType;
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
  | URLPart
  | LinkPart
  | RSTRefPart
  | CodePart
  | HorizontalLinePart
  | ErrorPart;

export type Paragraph = AnyPart[];

interface CommandParser {
  command: string;
  parameters: number;
  process: (args: string[], opts: ParsingOptions) => AnyPart;
}

const PARSER: CommandParser[] = [
  // Classic Ansible docs markup:
  {
    command: 'I',
    parameters: 1,
    process: (args) => {
      const text = args[0] as string;
      return <ItalicPart>{ type: PartType.ITALIC, text: text };
    },
  },
  {
    command: 'B',
    parameters: 1,
    process: (args) => {
      const text = args[0] as string;
      return <BoldPart>{ type: PartType.BOLD, text: text };
    },
  },
  {
    command: 'M',
    parameters: 1,
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
    process: (args) => {
      const url = args[0] as string;
      return <URLPart>{ type: PartType.URL, url: url };
    },
  },
  {
    command: 'L',
    parameters: 2,
    process: (args) => {
      const text = args[0] as string;
      const url = args[1] as string;
      return <LinkPart>{ type: PartType.LINK, text: text, url: url };
    },
  },
  {
    command: 'R',
    parameters: 2,
    process: (args) => {
      const text = args[0] as string;
      const ref = args[1] as string;
      return <RSTRefPart>{ type: PartType.RST_REF, text: text, ref: ref };
    },
  },
  {
    command: 'C',
    parameters: 1,
    process: (args) => {
      const text = args[0] as string;
      return <CodePart>{ type: PartType.CODE, text: text };
    },
  },
  {
    command: 'HORIZONTALLINE',
    parameters: 0,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    process: (args) => {
      return <HorizontalLinePart>{ type: PartType.HORIZONTAL_LINE };
    },
  },
];

const PARSER_COMMANDS: Map<string, CommandParser> = (() => {
  const result = new Map<string, CommandParser>();
  PARSER.forEach((cmd) => result.set(cmd.command, cmd));
  return result;
})();

function commandRE(command: CommandParser): string {
  return '\\b' + command.command + (command.parameters == 0 ? '\\b' : '\\(');
}

const COMMAND_RE = new RegExp('(' + PARSER.map(commandRE).join('|') + ')', 'g');

function lstripSpace(input: string): string {
  let index = 0;
  const length = input.length;
  while (index < length && input[index] === ' ') {
    index += 1;
  }
  return index > 0 ? input.slice(index) : input;
}

function rstripSpace(input: string) {
  const length = input.length;
  let index = length;
  while (index > 0 && input[index - 1] === ' ') {
    index -= 1;
  }
  return index < length ? input.slice(0, index) : input;
}

function parseUnescapedArgs(input: string, index: number, count: number): [string[], number, string | undefined] {
  const result: string[] = [];
  let first = true;
  let paramsLeft = count;
  while (paramsLeft > 1) {
    paramsLeft -= 1;
    const nextIndex = input.indexOf(',', index);
    if (nextIndex < 0) {
      return [result, input.length, `Cannot find comma separating parameter ${count - paramsLeft} from the next one`];
    }
    let parameter = input.slice(index, nextIndex);
    parameter = rstripSpace(parameter);
    if (first) {
      first = false;
    } else {
      parameter = lstripSpace(parameter);
    }
    result.push(parameter);
    index = nextIndex + 1;
  }
  const nextIndex = input.indexOf(')', index);
  if (nextIndex < 0) {
    return [result, input.length, 'Cannot find closing ")" after last parameter'];
  }
  let parameter = input.slice(index, nextIndex);
  if (!first) {
    parameter = lstripSpace(parameter);
  }
  result.push(parameter);
  return [result, nextIndex + 1, undefined];
}

function parseString(input: string, opts: ParsingOptions): Paragraph {
  const result: AnyPart[] = [];
  const commandRE = COMMAND_RE;
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
    if (!command) {
      throw Error(`Internal error: unknown command "${cmd}"`);
    }
    let args: string[];
    let error: string | undefined;
    if (command.parameters === 0) {
      args = [];
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
      error = `While parsing ${cmd}${command.parameters > 0 ? '()' : ''} at index ${match.index + 1}: ${error}`;
      switch (opts.errors || 'exception') {
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
  if (!Array.isArray(input)) {
    input = input ? [input] : [];
  }
  const opts_ = opts || {};
  return input.map((par) => parseString('' + par, opts_));
}
