# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2019-03-14

### Changed

- The API is now promise-based, so instead of returning a `ChildProcess` object,
  the result of calling `spawn`, it now returns a `Promise<SpawnSyncReturns<Buffer>>`.
  This improves the user-experience by making it easier to wait for the process
  to finish and get its error code. However, it is a breaking change for anything
  depending on the raw `ChildProcess`.
- The user-provided options are now added to the defaults, with the user options
  having a higher priority, instead of naively overwriting them. This allows the
  user to easily specify an option like `cwd` without having to _also_ specify
  the defaults in this case.

## [1.1.0] - 2019-03-13

### Added

- Multiple commands can now be executed in a single shell instance. These
  can either be executed in series or in parallel, depending on which function
  is called.

## [1.0.1] - 2019-03-12

### Added

- Information about the project to the README

## [1.0.0] - 2019-03-12

### Added

- Created the basic project, which allows spawning of terminal commands.

[unreleased]: https://github.com/dbpiper/terminal-spawn/compare/2.0.0...HEAD
[2.0.0]: https://github.com/dbpiper/terminal-spawn/compare/1.1.0...2.0.0
[1.1.0]: https://github.com/dbpiper/terminal-spawn/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/dbpiper/terminal-spawn/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/dbpiper/terminal-spawn/compare/releases/tag/1.0.0
