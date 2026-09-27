/**
 * Photo framing: the `{x, y, scale}` an organiser sets on a performer card.
 *
 * The bounds MIRROR `kefi-landings/src/lib/config-to-site.ts` (`photoTransform`,
 * MAX_PHOTO_OFFSET_PCT / MIN_PHOTO_SCALE / MAX_PHOTO_SCALE), which is what the
 * public landing page renders. The editor must never offer a value the landing
 * page would silently clamp away, so the numbers here and there must stay equal.
 * KEFI-PEOPLE-1 T12 "import the bounds instead of hard-coding them" removes the copy.
 *
 * This file imports nothing: it backs the framework-free `@dloizides/ui-media/framing`
 * subpath.
 */

/** A framing value after clamping: every field finite and inside the bounds. */
export interface PhotoFraming {
  /** Horizontal nudge, % of the card. Negative = left. */
  readonly x: number;
  /** Vertical nudge, % of the card. Negative = up. */
  readonly y: number;
  /** Zoom factor. 1 = the photo's natural cover fit. */
  readonly scale: number;
}

/** What config / an API may hold: any field missing, null or non-finite. */
export interface PhotoFramingInput {
  x?: number | null;
  y?: number | null;
  scale?: number | null;
}

export const PHOTO_FRAMING_BOUNDS = Object.freeze({
  /** Widest nudge, as a percentage of the card, in either direction. */
  maxOffsetPct: 60,
  /** Below 1 the photo shrinks inside an already-roomy frame. */
  minScale: 0.5,
  /** Far above 2 the subject's head leaves the card entirely. */
  maxScale: 3,
});

export const DEFAULT_PHOTO_FRAMING: PhotoFraming = Object.freeze({ x: 0, y: 0, scale: 1 });

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const finiteOr = (value: number | null | undefined, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

/**
 * Normalises any stored framing: non-finite fields fall back to the default,
 * the rest are clamped to {@link PHOTO_FRAMING_BOUNDS}. Same rules as the
 * landing page's `photoTransform`, so what the editor previews is what ships.
 */
export function clampFraming(input?: PhotoFramingInput | null): PhotoFraming {
  if (!input) return DEFAULT_PHOTO_FRAMING;
  const { maxOffsetPct, minScale, maxScale } = PHOTO_FRAMING_BOUNDS;
  return {
    x: clamp(finiteOr(input.x, DEFAULT_PHOTO_FRAMING.x), -maxOffsetPct, maxOffsetPct),
    y: clamp(finiteOr(input.y, DEFAULT_PHOTO_FRAMING.y), -maxOffsetPct, maxOffsetPct),
    scale: clamp(finiteOr(input.scale, DEFAULT_PHOTO_FRAMING.scale), minScale, maxScale),
  };
}

/** True when the framing is the identity (the landing page emits no transform). */
export const isDefaultFraming = (framing: PhotoFraming): boolean =>
  framing.x === DEFAULT_PHOTO_FRAMING.x &&
  framing.y === DEFAULT_PHOTO_FRAMING.y &&
  framing.scale === DEFAULT_PHOTO_FRAMING.scale;

/**
 * An RN `transform` array. Percent translates are relative to the element
 * itself on RN-web, matching the landing page's CSS `translate(x%, y%) scale(s)`.
 * Typed locally so this module stays free of a react-native import.
 */
export type PhotoFramingTransform = [
  { translateX: `${number}%` },
  { translateY: `${number}%` },
  { scale: number },
];

export const framingToTransform = (framing: PhotoFraming): PhotoFramingTransform => [
  { translateX: `${framing.x}%` },
  { translateY: `${framing.y}%` },
  { scale: framing.scale },
];
