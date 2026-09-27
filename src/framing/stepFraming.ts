import { FramingAction } from './FramingAction';
import type { PhotoFraming, PhotoFramingInput } from './photoFraming';
import { DEFAULT_PHOTO_FRAMING, clampFraming } from './photoFraming';

/** How far one press moves or zooms. */
export interface PhotoFramingSteps {
  /** Nudge per press, % of the card. */
  offsetPct: number;
  /** Zoom per press, as a scale delta. */
  scale: number;
}

export const PHOTO_FRAMING_STEPS: PhotoFramingSteps = Object.freeze({ offsetPct: 5, scale: 0.1 });

/** Three decimals, the same precision the landing page writes into its CSS. */
const PRECISION = 1000;
const round = (n: number): number => Math.round(n * PRECISION) / PRECISION;

type MoveAction = Exclude<FramingAction, FramingAction.Reset>;

/** [x, y, scale] direction of each non-reset action. */
const DIRECTIONS: Record<MoveAction, readonly [number, number, number]> = {
  [FramingAction.ZoomIn]: [0, 0, 1],
  [FramingAction.ZoomOut]: [0, 0, -1],
  [FramingAction.MoveUp]: [0, -1, 0],
  [FramingAction.MoveDown]: [0, 1, 0],
  [FramingAction.MoveLeft]: [-1, 0, 0],
  [FramingAction.MoveRight]: [1, 0, 0],
};

/**
 * Applies one control press. The result is always clamped and rounded, so ten
 * presses of +0.1 land on exactly 2, not 1.9999999999999998.
 */
export function stepFraming(
  current: PhotoFramingInput | null | undefined,
  action: FramingAction,
  steps: PhotoFramingSteps = PHOTO_FRAMING_STEPS,
): PhotoFraming {
  if (action === FramingAction.Reset) return DEFAULT_PHOTO_FRAMING;
  const base = clampFraming(current);
  const [dx, dy, ds] = DIRECTIONS[action];
  return clampFraming({
    x: round(base.x + dx * steps.offsetPct),
    y: round(base.y + dy * steps.offsetPct),
    scale: round(base.scale + ds * steps.scale),
  });
}

/** False when the press would change nothing (at a bound, or reset on the default). */
export function canStepFraming(
  current: PhotoFramingInput | null | undefined,
  action: FramingAction,
  steps: PhotoFramingSteps = PHOTO_FRAMING_STEPS,
): boolean {
  const base = clampFraming(current);
  const next = stepFraming(base, action, steps);
  return next.x !== base.x || next.y !== base.y || next.scale !== base.scale;
}
