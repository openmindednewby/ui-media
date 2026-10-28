import { act, renderHook, waitFor } from '@testing-library/react';

import { CutoutPhase } from './CutoutPhase';
import type { CutoutCut, CutoutEngine } from './types';
import { useCutoutSession } from './useCutoutSession';

const makeCut = (elapsedMs: number): CutoutCut => ({
  mask: { data: new Uint8ClampedArray(4), width: 2, height: 2 },
  image: new Uint8ClampedArray(16),
  elapsedMs,
});

const makeEngine = (removeBackground: CutoutEngine['removeBackground'], png = new Blob(['png'])): CutoutEngine => ({
  removeBackground,
  attachRefineBrush: () => () => undefined,
  encodeCutout: jest.fn(async () => png),
});

const image = new Blob(['photo']);

describe('useCutoutSession', () => {
  it('while the model runs, reports cutting', () => {
    const engine = makeEngine(async () => new Promise<CutoutCut>(() => undefined));

    const { result } = renderHook(() => useCutoutSession(engine, image));

    expect(result.current.phase).toBe(CutoutPhase.Cutting);
  });

  it('when the cut resolves, reports ready with the cut', async () => {
    const cut = makeCut(4180);
    const engine = makeEngine(async () => cut);

    const { result } = renderHook(() => useCutoutSession(engine, image));

    await waitFor(() => expect(result.current.phase).toBe(CutoutPhase.Ready));
    expect(result.current.cut).toBe(cut);
  });

  it('when the cut rejects, reports failed', async () => {
    const engine = makeEngine(async () => Promise.reject(new Error('no webgpu')));

    const { result } = renderHook(() => useCutoutSession(engine, image));

    await waitFor(() => expect(result.current.phase).toBe(CutoutPhase.Failed));
  });

  it('on apply, encodes the cut image with its mask and returns the png', async () => {
    const cut = makeCut(10);
    const png = new Blob(['png']);
    const engine = makeEngine(async () => cut, png);
    const { result } = renderHook(() => useCutoutSession(engine, image));
    await waitFor(() => expect(result.current.phase).toBe(CutoutPhase.Ready));
    let blob: Blob | null = null;

    await act(async () => {
      blob = await result.current.apply();
    });

    expect(engine.encodeCutout).toHaveBeenCalledWith(cut.image, cut.mask);
    expect(blob).toBe(png);
  });

  it('on apply before the cut is ready, returns null without encoding', async () => {
    const engine = makeEngine(async () => new Promise<CutoutCut>(() => undefined));
    const { result } = renderHook(() => useCutoutSession(engine, image));

    const blob = await result.current.apply();

    expect([blob, (engine.encodeCutout as jest.Mock).mock.calls.length]).toEqual([null, 0]);
  });
});
