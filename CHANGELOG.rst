==============================================================================================
antsibull-docs -- TypeScript library for processing Ansible documentation markup Release Notes
==============================================================================================

.. contents:: Topics


v0.1.0
======

Release Summary
---------------

First usable version, including semantic markup support.

Minor Changes
-------------

- Add support for semantic markup (https://github.com/ansible-community/antsibull-docs-ts/pull/1).
- Added MarkDown support (https://github.com/ansible-community/antsibull-docs-ts/pull/5).
- Allow to adjust formatting for HTML, RST, and MarkDown output by allowing to provide formatting functions for every part type (https://github.com/ansible-community/antsibull-docs-ts/pull/12).
- Allow to chose between antsibull-docs like formatting (for Sphinx targets) and plain formatting for HTML (https://github.com/ansible-community/antsibull-docs-ts/pull/12).
- Build both ESM and CommonJS modules for easier consumption in both webpack and node.js projects (https://github.com/ansible-community/antsibull-docs-ts/pull/14).
- Mention paragraph number in error messages when not processing single strings (https://github.com/ansible-community/antsibull-docs-ts/pull/11).

Breaking Changes / Porting Guide
--------------------------------

- The package was renamed on npmjs.com from ``antsibull_docs`` to ``antsibull-docs`` (https://github.com/ansible-community/antsibull-docs-ts/pull/15).

Bugfixes
--------

- Fix error message output for MarkDown. Make sure error message is escaped in RST. Fix error messages when parsing escaped parameters (https://github.com/ansible-community/antsibull-docs-ts/pull/8).
- The ``parse()`` option ``errors``'s default was ``exception``, and not ``message`` as documented. The default is now ``message`` (https://github.com/ansible-community/antsibull-docs-ts/pull/6).

v0.0.1
======

Release Summary
---------------

Initial release.
