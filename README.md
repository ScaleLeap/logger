![](https://raw.githubusercontent.com/ScaleLeap/logger/master/docs/assets/header.png)

📦 @scaleleap/logger
===================================

A universal logger for Scale Leap applications based on [Pino](https://github.com/pinojs/pino).

---

## Download & Installation

```sh
$ npm i -s @scaleleap/logger
```

## Usage

### createLogger(options?: LoggerOptions)

The `createLogger` function returns a pre-configured Pino instance. Optional parameters can be
passed to amend default configuration.

Example:

```ts
import { createLogger } from '@scaleleap/logger'

const log = createLogger()

log.info('Hello world')
```

### createTestLogger(options?: LoggerOptions)

Creates a logger suitable for tests. It does not write anything to screen, and instead writes
to a [ObjectWritableMock](https://github.com/b4nst/stream-mock).

It also attaches two properties to the logger instance:

 * `writableMock`: `ObjectWritableMock` instance
 * `logLines()`: a method that parses the JSON log to a `LogDescriptor` format

Example:

```ts
import { createTestLogger } from '@scaleleap/logger'

const logger = createTestLogger()

logger.info('foo')

const logLines = logger.logLines()

expect(logLines[0].msg).toBe('foo')
```

### log

An auto-instantiating logger instance.

An instance of logger will be created by using it.

Suitable for quick prototyping and quick scripts.

Example:

```ts
import { log } from '@scaleleap/logger'

log.info('Hello world')
```

## Environment Variables

You can control logger behavior through a set of environment variables:

 * `LOGGER_NAME`: Sets the logger name.
 * `LOGGER_LEVEL`: Sets the log level that will be emitted. See [Log Levels](#log-levels).
 * `LOGGER_ENABLED`: Enables or disables the logger. Default is `true`.
 * `LOGGER_CALLER`: Display caller information. Default is `false`.

## Log Levels

The following [log levels](https://github.com/pinojs/pino/blob/master/docs/api.md#loggerlevel-string-gettersetter) are supported:

* `trace`
* `debug`
* `info`
* `warn`
* `error`
* `fatal`
* `silent`

The following defaults are used, based on `NODE_ENV` values:

* `development` = `debug`
* `test` = `error`
* `production` = `info`

## Contributing

This repository uses [Conventional Commit](https://www.conventionalcommits.org/) style commit messages.

## Authors or Acknowledgments

* Roman Filippov ([Scale Leap](https://www.scaleleap.com))

## License

This project is licensed under the MIT License.

## Badges

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ScaleLeap/logger/CI)](https://github.com/ScaleLeap/logger/actions)
[![NPM](https://img.shields.io/npm/v/@scaleleap/logger)](https://npm.im/@scaleleap/logger)
[![License](https://img.shields.io/npm/l/@scaleleap/logger)](./LICENSE)
[![Coveralls](https://img.shields.io/coveralls/github/scaleleap/logger)](https://coveralls.io/github/ScaleLeap/logger)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)