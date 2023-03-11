/*
  Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
  SPDX-FileCopyrightText: Ansible Project
  SPDX-License-Identifier: BSD-2-Clause
*/

export function isFQCN(input: string): boolean {
  return input.match(/^[a-z0-9_]+\.[a-z0-9_]+(?:\.[a-z0-9_]+)+$/) !== null;
}

export function isPluginType(input: string): boolean {
  /* We do not want to hard-code a list of valid plugin types that might be inaccurate, so we simply check whether this is a valid kind of Python identifier usually used for plugin types. If ansible-core ever adds one with digits, we'll have to update this. */
  return /^[a-z_]+$/.test(input);
}
