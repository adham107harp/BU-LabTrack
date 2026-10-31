import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, getAuthToken, request, setAuthToken } from './api';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request()', () => {
  it('sends bearer token and JSON body, returns parsed JSON', async () => {
    setAuthToken('tok');
    const fetchMock = vi.fn().mockResolvedValue(json({ ok: 1 }));
    vi.stubGlobal('fetch', fetchMock);
    const out = await request<{ ok: number }>('/x', {
      method: 'POST',
      body: { a: 1 },
      fallbackMessage: 'fail',
    });
    expect(out).toEqual({ ok: 1 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/x$/);
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect(init.body).toBe('{"a":1}');
  });

  it('omits the token when auth is false', async () => {
    setAuthToken('tok');
    const fetchMock = vi.fn().mockResolvedValue(json({}));
    vi.stubGlobal('fetch', fetchMock);
    await request('/auth/login', { method: 'POST', body: {}, auth: false, fallbackMessage: 'f' });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('clears the token on 401 for authenticated calls', async () => {
    setAuthToken('tok');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'x' }, 401)));
    await expect(request('/x', { fallbackMessage: 'f' })).rejects.toMatchObject({ status: 401 });
    expect(getAuthToken()).toBeNull();
  });

  it('keeps the token and server message on a failed login (401, auth: false)', async () => {
    setAuthToken('tok');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Bad credentials' }, 401)));
    await expect(
      request('/auth/login', { method: 'POST', body: {}, auth: false, fallbackMessage: 'f' }),
    ).rejects.toThrow('Bad credentials');
    expect(getAuthToken()).toBe('tok');
  });

  it('falls back to a readable message when the error body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html>502</html>', { status: 502 })),
    );
    const err = (await request('/x', { fallbackMessage: 'Failed to fetch /x' }).catch(
      (e: unknown) => e,
    )) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe('Failed to fetch /x');
    expect(err.status).toBe(502);
  });

  it('turns network failures into a friendly error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(request('/x', { fallbackMessage: 'f' })).rejects.toThrow(
      /cannot reach the server/i,
    );
  });

  it('handles empty 204 responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(
      request('/x', { method: 'DELETE', fallbackMessage: 'f' }),
    ).resolves.toBeUndefined();
  });

  it('reports a 2xx non-JSON body as an ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html></html>', { status: 200 })),
    );
    await expect(request('/x', { fallbackMessage: 'f' })).rejects.toBeInstanceOf(ApiError);
  });

  it('returns undefined for an empty 200 body and surfaces authenticated 4xx messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('', { status: 200 })));
    await expect(request('/x', { fallbackMessage: 'f' })).resolves.toBeUndefined();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Lab full' }, 409)));
    await expect(request('/x', { method: 'POST', body: {}, fallbackMessage: 'f' })).rejects.toThrow(
      'Lab full',
    );
  });

  it('does not report unserialisable bodies as network errors', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    await expect(
      request('/x', { method: 'POST', body: circular, fallbackMessage: 'f' }),
    ).rejects.toThrow(/circular/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
