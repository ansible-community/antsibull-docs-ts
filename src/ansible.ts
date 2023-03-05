/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

export function isFQCN(input: string): boolean {
  return input.match(/^[a-z0-9_]+\.[a-z0-9_]+(?:\.[a-z0-9_]+)+$/) !== null;
}
