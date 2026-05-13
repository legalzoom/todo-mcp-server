import { describe, expect, it } from 'vitest';
import { errorMessage, resourceResponse, toolResponse } from './responses.js';

describe('errorMessage', () => {
  it('extracts message from Error', () => {
    expect(errorMessage(new Error('boom'))).toBe('boom');
  });

  it('stringifies non-Error values', () => {
    expect(errorMessage('oops')).toBe('oops');
    expect(errorMessage(42)).toBe('42');
  });
});

describe('toolResponse', () => {
  it('wraps success data', () => {
    const result = toolResponse({ data: { id: '1' } });
    expect(result.isError).toBe(false);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].mimeType).toBe('application/json');
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.data).toEqual({ id: '1' });
  });

  it('wraps error data with isError true', () => {
    const result = toolResponse({ errors: [{ detail: 'Not found' }] });
    expect(result.isError).toBe(true);
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.errors[0].detail).toBe('Not found');
  });

  it('includes links and meta in success response', () => {
    const result = toolResponse({ data: [], links: { next: '/page/2' }, meta: { total: 10 } });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.links.next).toBe('/page/2');
    expect(parsed.meta.total).toBe(10);
  });
});

describe('resourceResponse', () => {
  it('returns contents with self link', () => {
    const uri = new URL('todo://config');
    const result = resourceResponse({ data: { theme: 'dark' } }, uri);
    expect(result.contents).toHaveLength(1);
    expect(result.contents[0].uri).toBe('todo://config');
    expect(result.contents[0].mimeType).toBe('application/json');
    const parsed = JSON.parse(result.contents[0].text);
    expect(parsed.data).toEqual({ theme: 'dark' });
    expect(parsed.links.self).toBe('todo://config');
  });

  it('merges custom links with self', () => {
    const uri = new URL('todo://list');
    const result = resourceResponse({ data: [], links: { next: '/page/2' } }, uri);
    const parsed = JSON.parse(result.contents[0].text);
    expect(parsed.links.self).toBe('todo://list');
    expect(parsed.links.next).toBe('/page/2');
  });
});
