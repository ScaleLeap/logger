import pino, { Logger, LevelWithSilent, LoggerOptions } from 'pino'
import pinoDebug from 'pino-debug'
import pinoCaller from 'pino-caller'
import deepmerge from 'deepmerge'
import { LoggerConfig } from './config'

export { Logger } from 'pino'

export function loggerLevel(config: LoggerConfig): LevelWithSilent {
  if (config.LEVEL) {
    return config.LEVEL
  }

  switch (config.NODE_ENV) {
    case 'development':
      return 'debug'
    case 'test':
      return 'error'
    case 'production':
      return 'info'
    default:
      throw new Error(`Invalid NODE_ENV value "${config.NODE_ENV}".`)
  }
}

export function loggerPrettyPrint(): LoggerOptions['prettyPrint'] {
  return {
    translateTime: true,
    ignore: ['hostname', 'pid'].join(','),
  }
}

export function loggerOptions(config: LoggerConfig): LoggerOptions {
  const isPrettyPrintEnabled = process.stdout.isTTY && (config.isTest || config.isDevelopment)

  return {
    enabled: config.ENABLED,
    name: config.NAME,
    level: loggerLevel(config),
    prettyPrint: isPrettyPrintEnabled ? loggerPrettyPrint() : false,
    serializers: pino.stdSerializers,
  }
}

export function finalHandler(logger: Logger) {
  return pino.final(logger, (err, finalLogger, exitCode: number | null, message: string, ...args: unknown[]) => {
    if (exitCode !== null) {
      finalLogger.fatal(err, message, ...args)
    } else {
      finalLogger.info(message, ...args)
    }

    if (exitCode !== null && Number.isInteger(exitCode)) {
      process.exit(exitCode)
    }
  })
}

/**
 * Final logger can only be used with sync write destinations.
 *
 * * https://github.com/pinojs/pino/blob/master/docs/help.md#exit-logging
 * * https://github.com/pinojs/pino/blob/master/docs/api.md#pinofinallogger-handler--function--finallogger
 * * https://github.com/pinojs/pino-pretty/issues/37
 */
export function setupUnhandledRejectionHandler(final: ReturnType<typeof finalHandler>) {
  return process.on('unhandledRejection', (reason) => {
    const exitCode = 1

    // https://nodejs.org/api/process.html#process_event_unhandledrejection
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33636
    // Per NodeJS docs, "reason" is <Error> | <any> type.
    // But in the @types, "reason: is an "unknown" type, so we refine it.
    if (reason instanceof Error) {
      return final(reason, exitCode, 'unhandledRejection')
    } else {
      return final(null, exitCode, 'unhandledRejection with reason: %s', reason)
    }
  })
}

export function setupUncaughtExceptionHandler(final: ReturnType<typeof finalHandler>) {
  return process.on('uncaughtException', (err) => final(err, 1, 'uncaughtException'))
}

export function setupExitHandler(final: ReturnType<typeof finalHandler>) {
  return process.on('exit', (code) => final(null, null, 'exit with code %d.', code))
}

export function setupPinoCaller(logger: Logger): Logger {
  return pinoCaller(logger)
}

/**
 * Creates an instance of a logger and returns it.
 */
export function createLogger(options: Partial<LoggerOptions> = {}, config = new LoggerConfig()): Logger {
  const opts = deepmerge(loggerOptions(config), options)
  let logger = pino(opts)

  // TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/43882
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const dest = pino.destination({ sync: true })
  const finalLoggerHandler = finalHandler(pino(opts, dest))

  setupExitHandler(finalLoggerHandler)

  // We only setup global handlers in production, because the output is JSON and it is quite
  // messy to look at in development & testing. In those environments it is easier to look at the
  // default throw up of the NodeJS.
  if (config.isProduction) {
    setupUnhandledRejectionHandler(finalLoggerHandler)
    setupUncaughtExceptionHandler(finalLoggerHandler)
  }

  if (config.CALLER) {
    logger = setupPinoCaller(logger)
  }

  if (logger.isLevelEnabled('trace')) {
    // TODO: pinoDebug can only be called once
    pinoDebug(logger, {
      auto: true,
      map: {
        'scaleleap:*': 'debug',
        '*': 'trace',
      },
    })
  }

  return logger
}
