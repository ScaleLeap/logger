import { log } from './log'

describe('log', () => {
  it('should be defined', () => {
    expect.hasAssertions()

    expect(log).toBeDefined()
  })

  it('should look like pino', () => {
    expect.hasAssertions()

    expect(log).toHaveProperty('info')
    expect(log).toHaveProperty('warn')
    expect(log).not.toHaveProperty('FOOBAR')
  })

  it('should have pino methods', () => {
    expect.hasAssertions()

    expect(typeof log.info).toBe('function')
  })

  it('should be able to log', () => {
    expect.hasAssertions()

    const level = log.level
    log.level = 'fatal'

    expect(log.debug('foo')).toBeUndefined()

    log.level = level
  })
})
