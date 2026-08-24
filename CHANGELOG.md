# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- CI workflow (lint, test, build on push/PR to `main`).
- Pre-commit hook (husky + lint-staged) running ESLint on staged files.
- Unit tests for previously untested components (Checkbox, CurrencyInput,
  CustomizableSwitch, DataGrid, DatePicker, DndFileUpload, DotLoader,
  DragDropUpload, ExcelTable, FieldFeedback, FileUpload, FileUploadText,
  Filter, HTMLTable, HtmlEditor, InputText, Loader, LoaderMini, Modal,
  MultiSelect, MultiSelectWithCheckbox, Option, OptionWithIcon, RadioGroup,
  ReadOnly, SlideTabs, SocketStatus, Switch, Tabs, TextEditor, TextInput,
  Textarea, Tooltip).
- Automated accessibility checks (axe) as part of the test suite.
- Storybook for interactive component documentation.

### Changed

- Library build now preserves per-module output (`preserveModules`) instead
  of a single bundled file, so consumer bundlers can tree-shake unused
  components.

### Removed

- Unused `react-bootstrap` dependency.

### Fixed

- `dist/` and `playground-dist/` (build output) are no longer committed to
  git.

## [0.1.5] - prior to this changelog

Baseline released version. See git history for changes before this file
was introduced.
