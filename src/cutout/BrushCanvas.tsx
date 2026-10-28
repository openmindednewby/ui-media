import React, { useEffect, useRef } from 'react';

import type { CutoutSize } from './cutoutMath';
import type { CutoutCut, CutoutEngine } from './types';

interface BrushCanvasProps {
  engine: CutoutEngine;
  cut: CutoutCut;
  size: CutoutSize;
  getMode: () => string;
  getRadius: () => number;
  active: boolean;
  left: number;
  testID: string;
}

export const BrushCanvas = ({ engine, cut, size, getMode, getRadius, active, left, testID }: BrushCanvasProps): React.ReactElement => {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(getMode);
  const radiusRef = useRef(getRadius);
  modeRef.current = getMode;
  radiusRef.current = getRadius;

  useEffect(() => {
    const canvas = ref.current;
    if (canvas === null) return undefined;
    return engine.attachRefineBrush(canvas, {
      mask: cut.mask,
      image: cut.image,
      getMode: () => modeRef.current(),
      getRadius: () => radiusRef.current(),
    });
  }, [engine, cut]);

  return (
    <canvas
      data-testid={testID}
      ref={ref}
      style={{
        position: 'absolute',
        top: 0,
        left,
        width: size.width,
        height: size.height,
        pointerEvents: active ? 'auto' : 'none',
        touchAction: 'none',
      }}
    />
  );
};
