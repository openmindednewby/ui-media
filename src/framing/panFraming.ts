import type { PhotoFraming, PhotoFramingInput } from './photoFraming';
import { clampFraming } from './photoFraming';

export interface PanDelta {
  dx: number;
  dy: number;
}

export interface PanBox {
  width: number;
  height: number;
}

const PERCENT = 100;
const PRECISION = 1000;
const round = (n: number): number => Math.round(n * PRECISION) / PRECISION;

/** Moves the photo by a pointer drag of `delta` px over a preview box of `box` px. */
export function panFraming(start: PhotoFramingInput | null | undefined, delta: PanDelta, box: PanBox): PhotoFraming {
  const base = clampFraming(start);
  if (box.width <= 0 || box.height <= 0) return base;
  return clampFraming({
    x: round(base.x + (delta.dx / box.width) * PERCENT),
    y: round(base.y + (delta.dy / box.height) * PERCENT),
    scale: base.scale,
  });
}
