import { describe, it, expect } from 'vitest'
import catchError from '../../utils/catchError'

describe('catchError', () => {
  it('should return result on successful promise', async () => {
    const promise = Promise.resolve('success')
    const [error, result] = await catchError(promise)

    expect(error).toBeNull()
    expect(result).toBe('success')
  })

  it('should return error on rejected promise', async () => {
    const testError = new Error('Test error')
    const promise = Promise.reject(testError)
    const [error, result] = await catchError(promise)

    expect(error).toBe(testError)
    expect(result).toBeNull()
  })

  it('should handle async function that throws', async () => {
    const asyncFn = async () => {
      throw new Error('Async error')
    }
    const [error, result] = await catchError(asyncFn())

    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('Async error')
    expect(result).toBeNull()
  })

  it('should handle async function that resolves', async () => {
    const asyncFn = async () => {
      return { data: 'test' }
    }
    const [error, result] = await catchError(asyncFn())

    expect(error).toBeNull()
    expect(result).toEqual({ data: 'test' })
  })
})
