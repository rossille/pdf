import { describe, it, expect } from 'vitest';
import { newId } from './id';

describe('newId', () => {
  it('should return incrementing IDs', () => {
    const firstId = newId();
    const secondId = newId();
    const thirdId = newId();
    
    expect(secondId).toBe(firstId + 1);
    expect(thirdId).toBe(secondId + 1);
  });
});