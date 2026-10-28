import { CutoutLayout } from './CutoutLayout';
import { CutoutTool } from './CutoutTool';
import {
  CUTOUT_ZOOM,
  brushModeFor,
  canStepZoom,
  clampBrushRadius,
  clampPan,
  fitStage,
  formatSeconds,
  resolveCutoutLayout,
  splitAt,
  stepZoom,
} from './cutoutMath';

describe('resolveCutoutLayout', () => {
  it('with a 360 px phone, returns the drag split', () => {
    const width = 360;

    const layout = resolveCutoutLayout(width);

    expect(layout).toBe(CutoutLayout.Split);
  });

  it('with a 1280 px desktop, returns side by side', () => {
    const width = 1280;

    const layout = resolveCutoutLayout(width);

    expect(layout).toBe(CutoutLayout.SideBySide);
  });
});

describe('fitStage', () => {
  it('with a tall photo in a wide box, fits the height and keeps the aspect', () => {
    const box = { width: 600, height: 400 };
    const image = { width: 300, height: 600 };

    const stage = fitStage(box, image);

    expect(stage).toEqual({ width: 200, height: 400 });
  });

  it('with a wide photo in a tall box, fits the width', () => {
    const box = { width: 320, height: 600 };
    const image = { width: 800, height: 400 };

    const stage = fitStage(box, image);

    expect(stage).toEqual({ width: 320, height: 160 });
  });

  it('with an empty photo, returns a zero stage', () => {
    const box = { width: 320, height: 600 };
    const image = { width: 0, height: 400 };

    const stage = fitStage(box, image);

    expect(stage).toEqual({ width: 0, height: 0 });
  });
});

describe('splitAt', () => {
  it('with a pointer a quarter across, returns 0.25', () => {
    const x = 80;
    const width = 320;

    const split = splitAt(x, width);

    expect(split).toBe(0.25);
  });

  it('with a pointer past either edge, clamps to 0..1', () => {
    const width = 320;

    const result = [splitAt(-40, width), splitAt(400, width)];

    expect(result).toEqual([0, 1]);
  });

  it('with a zero-width stage, returns the middle', () => {
    const width = 0;

    const split = splitAt(10, width);

    expect(split).toBe(0.5);
  });
});

describe('stepZoom', () => {
  it('with zoom in from 100%, adds one step', () => {
    const zoom = 1;

    const next = stepZoom(zoom, 1);

    expect(next).toBe(1 + CUTOUT_ZOOM.step);
  });

  it('with zoom out at the minimum, stays at the minimum', () => {
    const zoom = CUTOUT_ZOOM.min;

    const next = stepZoom(zoom, -1);

    expect(next).toBe(CUTOUT_ZOOM.min);
  });

  it('with zoom in at the maximum, stays at the maximum', () => {
    const zoom = CUTOUT_ZOOM.max;

    const next = stepZoom(zoom, 1);

    expect(next).toBe(CUTOUT_ZOOM.max);
  });
});

describe('canStepZoom', () => {
  it('at the bounds, disables only the blocked direction', () => {
    const result = [canStepZoom(CUTOUT_ZOOM.min, -1), canStepZoom(CUTOUT_ZOOM.min, 1), canStepZoom(CUTOUT_ZOOM.max, 1)];

    expect(result).toEqual([false, true, false]);
  });
});

describe('clampPan', () => {
  it('at 100% zoom, pins the stage in place', () => {
    const pan = { x: 50, y: -30 };

    const next = clampPan(pan, 1, { width: 200, height: 100 });

    expect(next).toEqual({ x: 0, y: 0 });
  });

  it('at 200% zoom, allows half the stage each way', () => {
    const pan = { x: 500, y: -500 };

    const next = clampPan(pan, 2, { width: 200, height: 100 });

    expect(next).toEqual({ x: 100, y: -50 });
  });
});

describe('brushModeFor', () => {
  it('with each tool, returns keep, erase or no brush for move', () => {
    const tools = [CutoutTool.Keep, CutoutTool.Erase, CutoutTool.Move];

    const modes = tools.map(brushModeFor);

    expect(modes).toEqual(['keep', 'erase', null]);
  });
});

describe('clampBrushRadius', () => {
  it('with a radius outside 2..60, clamps and rounds it', () => {
    const radii = [0, 17.6, 900];

    const result = radii.map(clampBrushRadius);

    expect(result).toEqual([2, 18, 60]);
  });
});

describe('formatSeconds', () => {
  it('with 4180 ms, returns "4.2"', () => {
    const ms = 4180;

    const text = formatSeconds(ms);

    expect(text).toBe('4.2');
  });
});
