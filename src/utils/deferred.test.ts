import { describe, it, expect, vi } from 'vitest';
import { createDeferred } from './deferred';

describe('createDeferred', () => {
  it('should create a deferred object with promise, resolve, and reject properties', () => {
    const deferred = createDeferred();
    
    expect(deferred).toHaveProperty('promise');
    expect(deferred).toHaveProperty('resolve');
    expect(deferred).toHaveProperty('reject');
    expect(deferred.promise).toBeInstanceOf(Promise);
    expect(typeof deferred.resolve).toBe('function');
    expect(typeof deferred.reject).toBe('function');
  });

  it('should resolve the promise when resolve is called', async () => {
    const deferred = createDeferred<string>();
    const value = 'test value';
    
    // Create a mock to verify the promise resolves
    const resolveMock = vi.fn();
    deferred.promise.then(resolveMock);
    
    deferred.resolve(value);
    
    // Wait for promise to resolve
    await Promise.resolve();
    
    expect(resolveMock).toHaveBeenCalledWith(value);
  });

  it('should reject the promise when reject is called', async () => {
    const deferred = createDeferred();
    const error = new Error('test error');
    
    // Create a mock to verify the promise rejects
    const rejectMock = vi.fn();
    deferred.promise.catch(rejectMock);
    
    deferred.reject(error);
    
    // Wait for promise to reject
    await Promise.resolve();
    
    expect(rejectMock).toHaveBeenCalledWith(error);
  });
});