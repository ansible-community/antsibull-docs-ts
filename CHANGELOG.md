# antsibull\-docs \-\- TypeScript library for processing Ansible documentation markup Release Notes

**Topics**

- <a href="#v1-1-0">v1\.1\.0</a>
    - <a href="#release-summary">Release Summary</a>
    - <a href="#minor-changes">Minor Changes</a>
    - <a href="#bugfixes">Bugfixes</a>
- <a href="#v1-0-2">v1\.0\.2</a>
    - <a href="#release-summary-1">Release Summary</a>
    - <a href="#bugfixes-1">Bugfixes</a>
- <a href="#v1-0-1">v1\.0\.1</a>
    - <a href="#release-summary-2">Release Summary</a>
    - <a href="#bugfixes-2">Bugfixes</a>
- <a href="#v1-0-0">v1\.0\.0</a>
    - <a href="#release-summary-3">Release Summary</a>
- <a href="#v0-4-0">v0\.4\.0</a>
    - <a href="#release-summary-4">Release Summary</a>
    - <a href="#minor-changes-1">Minor Changes</a>
    - <a href="#breaking-changes--porting-guide">Breaking Changes / Porting Guide</a>
    - <a href="#bugfixes-3">Bugfixes</a>
- <a href="#v0-3-0">v0\.3\.0</a>
    - <a href="#release-summary-5">Release Summary</a>
    - <a href="#minor-changes-2">Minor Changes</a>
- <a href="#v0-2-0">v0\.2\.0</a>
    - <a href="#release-summary-6">Release Summary</a>
    - <a href="#minor-changes-3">Minor Changes</a>
    - <a href="#breaking-changes--porting-guide-1">Breaking Changes / Porting Guide</a>
    - <a href="#bugfixes-4">Bugfixes</a>
- <a href="#v0-1-0">v0\.1\.0</a>
    - <a href="#release-summary-7">Release Summary</a>
    - <a href="#minor-changes-4">Minor Changes</a>
    - <a href="#breaking-changes--porting-guide-2">Breaking Changes / Porting Guide</a>
    - <a href="#bugfixes-5">Bugfixes</a>
- <a href="#v0-0-1">v0\.0\.1</a>
    - <a href="#release-summary-8">Release Summary</a>

<a id="v1-1-0"></a>
## v1\.1\.0

<a id="release-summary"></a>
### Release Summary

Bugfix and feature release that improves markup parsing and generation with respect to whitespace handling and escaping\.

<a id="minor-changes"></a>
### Minor Changes

* Allow to determine how to handle whitespace during parsing with the new <code>whitespace</code> option \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/295](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/295)\)\.
* Always remove some whitespace around <code>HORIZONTALLINE</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/295](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/295)\)\.
* Apply postprocessing to RST and MarkDown to avoid generating invalid markup when input contains whitespace at potentially dangerous places \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/296](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/296)\)\.

<a id="bugfixes"></a>
### Bugfixes

* Do not apply URI encoding to visible URL \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/286](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/286)\)\.
* Fix RST escaping to handle other whitespace than spaces correctly \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/296](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/296)\)\.
* Improve handling of empty URL for links \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/286](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/286)\)\.

<a id="v1-0-2"></a>
## v1\.0\.2

<a id="release-summary-1"></a>
### Release Summary

Bugfix release\.

<a id="bugfixes-1"></a>
### Bugfixes

* Fix handling of empty markup parameters for RST \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/262](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/262)\)\.

<a id="v1-0-1"></a>
## v1\.0\.1

<a id="release-summary-2"></a>
### Release Summary

Maintenance release\.

<a id="bugfixes-2"></a>
### Bugfixes

* Properly escape MarkDown link targets \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/197](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/197)\)\.

<a id="v1-0-0"></a>
## v1\.0\.0

<a id="release-summary-3"></a>
### Release Summary

First stable release\. This package is using semantic versioning\, so there will be no more breaking changes until the release of 2\.0\.0\.

<a id="v0-4-0"></a>
## v0\.4\.0

<a id="release-summary-4"></a>
### Release Summary

New major release that increases compatibility with the [Python code in antsibull\-docs\-parser](https\://github\.com/ansible\-community/antsibull\-docs\-parser)\.

<a id="minor-changes-1"></a>
### Minor Changes

* Also escape <code>\.</code> in MarkDown \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/51](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/51)\)\.

<a id="breaking-changes--porting-guide"></a>
### Breaking Changes / Porting Guide

* Rename <code>current\_plugin</code> options of various functions to <code>currentPlugin</code>\, and the <code>role\_entrypoint</code> option of <code>parse</code> to <code>roleEntrypoint</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/49](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/49)\)\.

<a id="bugfixes-3"></a>
### Bugfixes

* Fix URL escaping in MarkDown \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/51](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/51)\)\.

<a id="v0-3-0"></a>
## v0\.3\.0

<a id="release-summary-5"></a>
### Release Summary

Feature release\.

<a id="minor-changes-2"></a>
### Minor Changes

* Add support for plain RST rendering \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/42](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/42)\)\.

<a id="v0-2-0"></a>
## v0\.2\.0

<a id="release-summary-6"></a>
### Release Summary

New major release that increases compatibility with the [Python code in antsibull\-docs\-parser](https\://github\.com/ansible\-community/antsibull\-docs\-parser)\.

<a id="minor-changes-3"></a>
### Minor Changes

* Add support for ansible\-doc like text output \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/36](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/36)\)\.
* Add support for semantic markup in roles \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/31](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/31)\)\.
* Allow to add markup source to every paragraph part \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/37](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/37)\)\.
* Can switch between error messages containing a shortened version of the faulty markup or the full faulty markup command \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/38](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/38)\)\.
* Improve error messages by removing superfluous second <code>Error\:</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22)\)\.
* Make parsing of <code>P\(\.\.\.\)</code> more similar to Python code with respect to error reporting \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22)\)\.

<a id="breaking-changes--porting-guide-1"></a>
### Breaking Changes / Porting Guide

* All DOM parts have a new <code>source</code> property\, which must be a string or <code>undefined</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/37](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/37)\)\.
* By default\, the error messages now contain the full faulty markup command \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/38](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/38)\)\.
* Extend <code>OptionNamePart</code> and <code>ReturnValuePart</code> interfaces by adding <code>entrypoint</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-parser/pull/9](https\://github\.com/ansible\-community/antsibull\-docs\-parser/pull/9)\)\.
* Modify <code>pluginOptionLikeLink</code> signature to include a new argument <code>entrypoint</code> after <code>plugin</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/31](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/31)\)\.
* Rename <code>only\_classic\_markup</code> parser option to <code>onlyClassicMarkup</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22)\)\.

<a id="bugfixes-4"></a>
### Bugfixes

* HTML and MarkDown code\: quote HTML command arguments correctly\; make sure URLs are correctly quoted \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/22)\)\.

<a id="v0-1-0"></a>
## v0\.1\.0

<a id="release-summary-7"></a>
### Release Summary

First usable version\, including semantic markup support\.

<a id="minor-changes-4"></a>
### Minor Changes

* Add support for semantic markup \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/1](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/1)\)\.
* Added MarkDown support \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/5](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/5)\)\.
* Allow to adjust formatting for HTML\, RST\, and MarkDown output by allowing to provide formatting functions for every part type \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/12](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/12)\)\.
* Allow to chose between antsibull\-docs like formatting \(for Sphinx targets\) and plain formatting for HTML \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/12](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/12)\)\.
* Build both ESM and CommonJS modules for easier consumption in both webpack and node\.js projects \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/14](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/14)\)\.
* Mention paragraph number in error messages when not processing single strings \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/11](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/11)\)\.

<a id="breaking-changes--porting-guide-2"></a>
### Breaking Changes / Porting Guide

* The package was renamed on npmjs\.com from <code>antsibull\_docs</code> to <code>antsibull\-docs</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/15](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/15)\)\.

<a id="bugfixes-5"></a>
### Bugfixes

* Fix error message output for MarkDown\. Make sure error message is escaped in RST\. Fix error messages when parsing escaped parameters \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/8](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/8)\)\.
* The <code>parse\(\)</code> option <code>errors</code>\'s default was <code>exception</code>\, and not <code>message</code> as documented\. The default is now <code>message</code> \([https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/6](https\://github\.com/ansible\-community/antsibull\-docs\-ts/pull/6)\)\.

<a id="v0-0-1"></a>
## v0\.0\.1

<a id="release-summary-8"></a>
### Release Summary

Initial release\.
