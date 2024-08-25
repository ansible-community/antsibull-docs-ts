==============================================================================================
antsibull-docs -- TypeScript library for processing Ansible documentation markup Release Notes
==============================================================================================

.. contents:: Topics

v1.1.0
======

Release Summary
---------------

Bugfix and feature release that improves markup parsing and generation with respect to whitespace handling and escaping.

Minor Changes
-------------

- Allow to determine how to handle whitespace during parsing with the new ``whitespace`` option (https://github.com/ansible-community/antsibull-docs-ts/pull/295).
- Always remove some whitespace around ``HORIZONTALLINE`` (https://github.com/ansible-community/antsibull-docs-ts/pull/295).
- Apply postprocessing to RST and MarkDown to avoid generating invalid markup when input contains whitespace at potentially dangerous places (https://github.com/ansible-community/antsibull-docs-ts/pull/296).

Bugfixes
--------

- Do not apply URI encoding to visible URL (https://github.com/ansible-community/antsibull-docs-ts/pull/286).
- Fix RST escaping to handle other whitespace than spaces correctly (https://github.com/ansible-community/antsibull-docs-ts/pull/296).
- Improve handling of empty URL for links (https://github.com/ansible-community/antsibull-docs-ts/pull/286).

v1.0.2
======

Release Summary
---------------

Bugfix release.

Bugfixes
--------

- Fix handling of empty markup parameters for RST (https://github.com/ansible-community/antsibull-docs-ts/pull/262).

v1.0.1
======

Release Summary
---------------

Maintenance release.

Bugfixes
--------

- Properly escape MarkDown link targets (https://github.com/ansible-community/antsibull-docs-ts/pull/197).

v1.0.0
======

Release Summary
---------------

First stable release. This package is using semantic versioning, so there will be no more breaking changes until the release of 2.0.0.

v0.4.0
======

Release Summary
---------------

New major release that increases compatibility with the `Python code in antsibull-docs-parser <https://github.com/ansible-community/antsibull-docs-parser>`__.

Minor Changes
-------------

- Also escape ``.`` in MarkDown (https://github.com/ansible-community/antsibull-docs-ts/pull/51).

Breaking Changes / Porting Guide
--------------------------------

- Rename ``current_plugin`` options of various functions to ``currentPlugin``, and the ``role_entrypoint`` option of ``parse`` to ``roleEntrypoint`` (https://github.com/ansible-community/antsibull-docs-ts/pull/49).

Bugfixes
--------

- Fix URL escaping in MarkDown (https://github.com/ansible-community/antsibull-docs-ts/pull/51).

v0.3.0
======

Release Summary
---------------

Feature release.

Minor Changes
-------------

- Add support for plain RST rendering (https://github.com/ansible-community/antsibull-docs-ts/pull/42).

v0.2.0
======

Release Summary
---------------

New major release that increases compatibility with the `Python code in antsibull-docs-parser <https://github.com/ansible-community/antsibull-docs-parser>`__.

Minor Changes
-------------

- Add support for ansible-doc like text output (https://github.com/ansible-community/antsibull-docs-ts/pull/36).
- Add support for semantic markup in roles (https://github.com/ansible-community/antsibull-docs-ts/pull/31).
- Allow to add markup source to every paragraph part (https://github.com/ansible-community/antsibull-docs-ts/pull/37).
- Can switch between error messages containing a shortened version of the faulty markup or the full faulty markup command (https://github.com/ansible-community/antsibull-docs-ts/pull/38).
- Improve error messages by removing superfluous second ``Error:`` (https://github.com/ansible-community/antsibull-docs-ts/pull/22).
- Make parsing of ``P(...)`` more similar to Python code with respect to error reporting (https://github.com/ansible-community/antsibull-docs-ts/pull/22).

Breaking Changes / Porting Guide
--------------------------------

- All DOM parts have a new ``source`` property, which must be a string or ``undefined`` (https://github.com/ansible-community/antsibull-docs-ts/pull/37).
- By default, the error messages now contain the full faulty markup command (https://github.com/ansible-community/antsibull-docs-ts/pull/38).
- Extend ``OptionNamePart`` and ``ReturnValuePart`` interfaces by adding ``entrypoint`` (https://github.com/ansible-community/antsibull-docs-parser/pull/9).
- Modify ``pluginOptionLikeLink`` signature to include a new argument ``entrypoint`` after ``plugin`` (https://github.com/ansible-community/antsibull-docs-ts/pull/31).
- Rename ``only_classic_markup`` parser option to ``onlyClassicMarkup`` (https://github.com/ansible-community/antsibull-docs-ts/pull/22).

Bugfixes
--------

- HTML and MarkDown code: quote HTML command arguments correctly; make sure URLs are correctly quoted (https://github.com/ansible-community/antsibull-docs-ts/pull/22).

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
