// Simplified BSD License (see LICENSES/BSD-2-Clause.txt or https://opensource.org/licenses/BSD-2-Clause)
// SPDX-FileCopyrightText: Ansible Project
// SPDX-License-Identifier: BSD-2-Clause

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
};
