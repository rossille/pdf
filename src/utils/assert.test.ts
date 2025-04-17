import { describe, it, expect } from 'vitest';
import { assert } from './assert';

describe('assert', () => {
  it('should not throw error when condition is true', () => {
    expect(() => assert(true, 'Error message')).not.toThrow();
  });

  it('should throw error with provided message when condition is false', () => {
    const errorMessage = 'Test error message';
    expect(() => assert(false, errorMessage)).toThrow(errorMessage);
  });
});