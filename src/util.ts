/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

export function splitLines(line: string): string[] {
  // The regex uses the line separators listed in https://docs.python.org/3/library/stdtypes.html#str.splitlines

  /* eslint-disable-next-line no-control-regex */
  const lines = line.split(/(?:\r\n|\n|\r|\v|\f|\x1c|\x1d|\x1e|\x85|\u2028|\u2029)/);
  if (lines.length && lines[lines.length - 1] === '') {
    lines.splice(lines.length - 1, 1);
  }
  return lines;
}

export function startsWith(text: string, prefix: string, start: number = 0, end?: number): boolean {
  const prefixLen = prefix.length;
  const textLen = text.length;
  if (start < 0 || start + prefixLen > textLen) {
    return false;
  }
  end = end ?? textLen;
  if (start + prefixLen > end) {
    return false;
  }
  return text.startsWith(prefix, start);
}

export function endsWith(text: string, prefix: string, start: number = 0, end?: number): boolean {
  const prefixLen = prefix.length;
  const textLen = text.length;
  if (start < 0 || start + prefixLen > textLen) {
    return false;
  }
  end = end ?? textLen;
  if (start + prefixLen > end) {
    return false;
  }
  return text.endsWith(prefix, end);
}
