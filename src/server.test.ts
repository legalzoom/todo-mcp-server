import { describe, it, expect } from 'vitest';
import { initializeServer } from './server.js';

describe('initializeServer', () => {
  it('returns an McpServer instance', () => {
    const server = initializeServer();
    expect(server).toBeDefined();
    expect(server.server).toBeDefined();
  });

  it('registers tools, resources, and prompts', () => {
    const server = initializeServer();
    expect(server.tool).toBeDefined();
    expect(server.resource).toBeDefined();
    expect(server.prompt).toBeDefined();
  });
});
