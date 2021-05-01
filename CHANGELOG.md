# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased


## [2.0.0-alpha.1] - 2021-04-28
### Changed
- adjust SDK to new way of storing FCD
- update ethers library

## [1.0.0] - 2021-04-15
### Changed
- update `Chain` to version that works based `dataTimestamp` and has `getStatus`

## [0.10.0] - 2021-03-24
### Added
- export `Registry` abi

### Changed
- update contracts abis

## [0.9.0] - 2021-03-18
### Changed
- updated `Chain` to v0.3.0

## [0.8.1] - 2021-03-10
### Changed
- updated `Chain` abi for v0.2.0

## [0.8.0] - 2021-03-10
### Changed
- `Chain` abi v0.2.0

## [0.7.4] - 2021-03-09
### Added
- `IRegistry` interface

## [0.7.3] - 2021-03-09
### Fixed
- package.json version

## [0.7.2] - 2021-03-09
### Fixed
- fixed linters errors for `/abi/*.ts`

### Updated
- `IChain.sol` (with new chain abi)

## [0.7.1] - 2021-03-03
### Fixed
- fix TypeError in `IChain.sol` about calldata

## [0.7.0] - 2021-03-03
### Added
- `IChain.sol` interface

## [0.6.1] - 2021-03-01
### Fixed
- bump version in `package.json`

## [0.6.0] - 2021-02-28
### Added
- API SDK

## [0.5.2] - 2021-02-24
### Fixed
- revert fixed node version

## [0.5.1] - 2021-02-24
### Fixed
- coding/decoding float numbers

## [0.5.0] - 2021-02-21
### Updated
- chain contract abi

## [0.4.0] - 2020-12-17
### Added
- add ABIs for `Chain` and `ValidatorRegistry`

## [0.3.0] - 2020-12-14
### Added
- basic converter methods are available under `toolbox.converters`
- `strToBytes32`
- `numberToUint256`

### Removed
- remove default export

## [0.2.0] - 2020-12-07
### Added
- contract registry

## [0.1.0] - 2020-12-01
### Added
- initial version with support of: hex, integer and float types of data
