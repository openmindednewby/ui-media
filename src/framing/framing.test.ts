import { FramingAction } from './FramingAction';
import {
  DEFAULT_PHOTO_FRAMING,
  PHOTO_FRAMING_BOUNDS,
  clampFraming,
  framingToTransform,
  isDefaultFraming,
} from './photoFraming';
import { canStepFraming, stepFraming } from './stepFraming';

describe('PHOTO_FRAMING_BOUNDS', () => {
  it('matches kefi-landings photoTransform (config-to-site.ts offset 60, scale 0.5..3)', () => {
    expect(PHOTO_FRAMING_BOUNDS).toEqual({ maxOffsetPct: 60, minScale: 0.5, maxScale: 3 });
  });
});

describe('clampFraming', () => {
  it('returns the default for null / undefined', () => {
    expect(clampFraming(null)).toEqual(DEFAULT_PHOTO_FRAMING);
    expect(clampFraming(undefined)).toEqual(DEFAULT_PHOTO_FRAMING);
  });

  it('falls back per field for missing, null and non-finite values', () => {
    expect(clampFraming({ x: Number.NaN, y: null, scale: Number.POSITIVE_INFINITY })).toEqual(DEFAULT_PHOTO_FRAMING);
    expect(clampFraming({ x: 10 })).toEqual({ x: 10, y: 0, scale: 1 });
  });

  it('clamps offsets to +/-60 and scale to 0.5..3', () => {
    expect(clampFraming({ x: -500, y: 500, scale: 99 })).toEqual({ x: -60, y: 60, scale: 3 });
    expect(clampFraming({ x: 0, y: 0, scale: 0.01 }).scale).toBe(0.5);
  });

  it('leaves in-range values untouched', () => {
    expect(clampFraming({ x: -12.5, y: 33, scale: 1.4 })).toEqual({ x: -12.5, y: 33, scale: 1.4 });
  });
});

describe('isDefaultFraming', () => {
  it('is true only for the identity', () => {
    expect(isDefaultFraming(DEFAULT_PHOTO_FRAMING)).toBe(true);
    expect(isDefaultFraming({ x: 0, y: 0, scale: 1.1 })).toBe(false);
  });
});

describe('stepFraming', () => {
  it('moves by one offset step in the pressed direction', () => {
    expect(stepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.MoveUp)).toEqual({ x: 0, y: -5, scale: 1 });
    expect(stepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.MoveDown)).toEqual({ x: 0, y: 5, scale: 1 });
    expect(stepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.MoveLeft)).toEqual({ x: -5, y: 0, scale: 1 });
    expect(stepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.MoveRight)).toEqual({ x: 5, y: 0, scale: 1 });
  });

  it('zooms without float drift', () => {
    let framing = DEFAULT_PHOTO_FRAMING;
    for (let i = 0; i < 10; i += 1) framing = stepFraming(framing, FramingAction.ZoomIn);
    expect(framing.scale).toBe(2);
    expect(stepFraming(framing, FramingAction.ZoomOut).scale).toBe(1.9);
  });

  it('never steps past the bounds', () => {
    expect(stepFraming({ x: 58, y: 0, scale: 1 }, FramingAction.MoveRight).x).toBe(60);
    expect(stepFraming({ x: 0, y: 0, scale: 3 }, FramingAction.ZoomIn).scale).toBe(3);
    expect(stepFraming({ x: 0, y: 0, scale: 0.5 }, FramingAction.ZoomOut).scale).toBe(0.5);
  });

  it('clamps an out-of-range stored value before stepping', () => {
    expect(stepFraming({ x: 900, y: null, scale: null }, FramingAction.MoveLeft)).toEqual({ x: 55, y: 0, scale: 1 });
  });

  it('honours custom steps and resets to the default', () => {
    expect(stepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.MoveRight, { offsetPct: 1, scale: 0.25 }).x).toBe(1);
    expect(stepFraming({ x: 20, y: -10, scale: 2 }, FramingAction.Reset)).toEqual(DEFAULT_PHOTO_FRAMING);
  });
});

describe('canStepFraming', () => {
  it('is false at a bound and for reset on the default', () => {
    expect(canStepFraming({ x: 0, y: 0, scale: 3 }, FramingAction.ZoomIn)).toBe(false);
    expect(canStepFraming({ x: 0, y: -60, scale: 1 }, FramingAction.MoveUp)).toBe(false);
    expect(canStepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.Reset)).toBe(false);
  });

  it('is true when the press changes something', () => {
    expect(canStepFraming(DEFAULT_PHOTO_FRAMING, FramingAction.ZoomIn)).toBe(true);
    expect(canStepFraming({ x: 5, y: 0, scale: 1 }, FramingAction.Reset)).toBe(true);
  });
});

describe('framingToTransform', () => {
  it('builds percent translates then scale', () => {
    expect(framingToTransform({ x: -10, y: 5, scale: 1.2 })).toEqual([
      { translateX: '-10%' },
      { translateY: '5%' },
      { scale: 1.2 },
    ]);
  });
});
