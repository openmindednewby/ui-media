import { useCallback, useEffect, useRef, useState } from 'react';

import { CutoutPhase } from './CutoutPhase';
import type { CutoutCut, CutoutEngine } from './types';

export interface CutoutSession {
  phase: CutoutPhase;
  cut: CutoutCut | null;
  apply: () => Promise<Blob | null>;
}

/** Runs the engine on `image` once, then encodes the (brushed) mask on apply. */
export function useCutoutSession(engine: CutoutEngine, image: Blob): CutoutSession {
  const [phase, setPhase] = useState<CutoutPhase>(CutoutPhase.Cutting);
  const [cut, setCut] = useState<CutoutCut | null>(null);
  const cutRef = useRef<CutoutCut | null>(null);

  useEffect(() => {
    let live = true;
    cutRef.current = null;
    setCut(null);
    setPhase(CutoutPhase.Cutting);
    engine.removeBackground(image).then(
      (result) => {
        if (!live) return;
        cutRef.current = result;
        setCut(result);
        setPhase(CutoutPhase.Ready);
      },
      () => {
        if (live) setPhase(CutoutPhase.Failed);
      },
    );
    return () => {
      live = false;
    };
  }, [engine, image]);

  const apply = useCallback(async (): Promise<Blob | null> => {
    const ready = cutRef.current;
    if (ready === null) return null;
    setPhase(CutoutPhase.Saving);
    try {
      return await engine.encodeCutout(ready.image, ready.mask);
    } catch {
      setPhase(CutoutPhase.Failed);
      return null;
    }
  }, [engine]);

  return { phase, cut, apply };
}
