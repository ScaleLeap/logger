import { createLogger, createTestLogger, log } from './index'

describe('index', () => {
  test('should export createLogger function', () => {
    expect(typeof createLogger).toBe('function')
  })

  test('should export createTestLogger function', () => {
    expect(typeof createTestLogger).toBe('function')
  })

  test('should export log object', () => {
    expect(log).toBeTruthy()
  })
})
