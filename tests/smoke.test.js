import { describe, it, expect } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

describe('Smoke Test - Mount of Mercy Core', () => {
  it('loads script.js and exports core functions', () => {
    const app = loadApp();
    expect(app).toBeDefined();
    expect(typeof app.toGeez).toBe('function');
    expect(typeof app.convertLxxToMt).toBe('function');
    expect(typeof app.getMtFromLxx).toBe('function');
  });
});
