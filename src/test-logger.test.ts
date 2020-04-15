import { createTestLogger } from './test-logger'

describe(createTestLogger.name, () => {
  it('should return a logger without any params', () => {
    expect.assertions(1)

    const logger = createTestLogger()

    expect(logger).toHaveProperty('info')
  })

  it('logger should have a mock property', () => {
    expect.assertions(2)

    const logger = createTestLogger()

    expect(logger).toHaveProperty('writableMock')
    expect(typeof logger.writableMock).toBe('object')
  })

  it('mock should intercept logger calls', () => {
    expect.assertions(2)

    const msg = 'hello world'
    const logger = createTestLogger()

    logger.info(msg)
    const logLines = logger.logLines()

    expect(logLines.length).toBe(1)
    expect(logLines[0].msg).toBe(msg)
  })
})
