import { act, renderHook, waitFor } from '@testing-library/react';
import { Image } from 'react-native';

import { PhotoAnchor } from '../PhotoFramingEditor/PhotoAnchor';
import { resolveAnchoredPhotoLayout } from './resolveAnchoredPhotoLayout';
import { useImageAspectRatio } from './useImageAspectRatio';

type Success = (width: number, height: number) => void;

describe('resolveAnchoredPhotoLayout', () => {
  it('anchors to the bottom edge with the measured aspect', () => {
    expect(resolveAnchoredPhotoLayout(PhotoAnchor.Bottom, 0.5)).toEqual({ justifyContent: 'flex-end', aspectRatio: 0.5 });
  });

  it('centres for the center anchor', () => {
    expect(resolveAnchoredPhotoLayout(PhotoAnchor.Center, 2).justifyContent).toBe('center');
  });

  it.each([null, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])('falls back to fill for unusable aspect %p', (ratio) => {
    expect(resolveAnchoredPhotoLayout(PhotoAnchor.Bottom, ratio).aspectRatio).toBeNull();
  });
});

describe('useImageAspectRatio', () => {
  afterEach(() => jest.restoreAllMocks());

  it('reports width / height once measured', async () => {
    jest.spyOn(Image, 'getSize').mockImplementation((_uri: string, ok: Success) => ok(400, 800));
    const { result } = renderHook(() => useImageAspectRatio('a.png'));
    await waitFor(() => expect(result.current).toBe(0.5));
  });

  it('stays null for an empty uri without measuring', () => {
    const spy = jest.spyOn(Image, 'getSize');
    const { result } = renderHook(() => useImageAspectRatio(''));
    expect(result.current).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });

  it('ignores zero-sized results and failures', () => {
    jest.spyOn(Image, 'getSize').mockImplementation((_uri: string, ok: Success) => ok(0, 10));
    const { result } = renderHook(() => useImageAspectRatio('b.png'));
    expect(result.current).toBeNull();
  });

  it('drops a stale ratio when the uri changes', async () => {
    const calls: Array<{ uri: string; ok: Success }> = [];
    jest.spyOn(Image, 'getSize').mockImplementation((uri: string, ok: Success) => {
      calls.push({ uri, ok });
    });
    const { result, rerender } = renderHook(({ uri }) => useImageAspectRatio(uri), { initialProps: { uri: 'one.png' } });
    act(() => calls[0]?.ok(100, 100));
    expect(result.current).toBe(1);
    rerender({ uri: 'two.png' });
    expect(result.current).toBeNull();
  });
});
