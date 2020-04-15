import pino, { LoggerOptions, LogDescriptor } from 'pino'
import { ObjectWritableMock } from 'stream-mock'

function logLines(lines: string[]) {
  return lines.map<LogDescriptor>((line) => JSON.parse(line))
}

export function createTestLogger(options: Partial<LoggerOptions> = {}) {
  const writableMock = new ObjectWritableMock()

  return Object.assign(pino(options, writableMock), {
    writableMock,
    logLines: () => logLines(writableMock.data),
  })
}
