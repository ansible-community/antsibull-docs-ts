/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

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

export function parseEscapedArgs(input: string, index: number, count: number): [string[], number, string | undefined] {
  const result: string[] = [];
  let parameter_count = count;
  const escapeOrComma = /\\(.)| *(,) */g;
  while (parameter_count > 1) {
    parameter_count -= 1;
    const value: string[] = [];
    while (true) {
      escapeOrComma.lastIndex = index;
      const match = escapeOrComma.exec(input);
      if (!match) {
        result.push(value.join(''));
        return [
          result,
          input.length,
          `Cannot find comma separating parameter ${count - parameter_count} from the next one`,
        ];
      }
      if (match.index > index) {
        value.push(input.substring(index, match.index));
      }
      index = match.index + match[0].length;
      if (match[1] === undefined) {
        break;
      }
      value.push(match[1]);
    }
    result.push(value.join(''));
  }
  const escapeOrClosing = /\\(.)|([)])/g;
  const value: string[] = [];
  while (true) {
    escapeOrClosing.lastIndex = index;
    const match = escapeOrClosing.exec(input);
    if (!match) {
      result.push(value.join(''));
      return [result, input.length, 'Cannot find closing ")" after last parameter'];
    }
    if (match.index > index) {
      value.push(input.substring(index, match.index));
    }
    index = match.index + match[0].length;
    if (match[1] === undefined) {
      break;
    }
    value.push(match[1]);
  }
  result.push(value.join(''));
  return [result, index, undefined];
}

export function parseUnescapedArgs(
  input: string,
  index: number,
  count: number,
): [string[], number, string | undefined] {
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
