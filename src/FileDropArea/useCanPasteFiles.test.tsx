import { act, renderHook } from '@testing-library/react';

import { useCanPasteFiles } from './useCanPasteFiles';

function setNavigator(key: 'clipboard' | 'permissions', value: unknown): void {
  Object.defineProperty(navigator, key, { value, configurable: true, writable: true });
}

function permissionStatus(state: string): PermissionStatus {
  return { state, addEventListener: jest.fn(), removeEventListener: jest.fn() } as unknown as PermissionStatus;
}

describe('useCanPasteFiles', () => {
  it('with clipboard.read and permission granted, returns true', async () => {
    setNavigator('clipboard', { read: jest.fn() });
    setNavigator('permissions', { query: jest.fn(async () => permissionStatus('granted')) });

    const { result } = renderHook(() => useCanPasteFiles());
    await act(async () => Promise.resolve());

    expect(result.current).toBe(true);
  });

  it('with clipboard.read and permission denied, returns false', async () => {
    setNavigator('clipboard', { read: jest.fn() });
    setNavigator('permissions', { query: jest.fn(async () => permissionStatus('denied')) });

    const { result } = renderHook(() => useCanPasteFiles());
    await act(async () => Promise.resolve());

    expect(result.current).toBe(false);
  });

  it('when the permission query rejects, keeps returning true', async () => {
    setNavigator('clipboard', { read: jest.fn() });
    setNavigator('permissions', { query: jest.fn(async () => Promise.reject(new TypeError('unknown name'))) });

    const { result } = renderHook(() => useCanPasteFiles());
    await act(async () => Promise.resolve());

    expect(result.current).toBe(true);
  });

  it('without clipboard.read, returns false', () => {
    setNavigator('clipboard', { readText: jest.fn() });
    setNavigator('permissions', undefined);

    const { result } = renderHook(() => useCanPasteFiles());

    expect(result.current).toBe(false);
  });
});
