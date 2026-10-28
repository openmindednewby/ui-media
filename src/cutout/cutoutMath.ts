import { LAYOUT_COLLAPSE_BREAKPOINT } from '@dloizides/ui-layout';

import { CutoutLayout } from './CutoutLayout';
import { CutoutTool } from './CutoutTool';

export interface CutoutSize {
  width: number;
  height: number;
}

export interface CutoutPoint {
  x: number;
  y: number;
}

export const CUTOUT_ZOOM = Object.freeze({ min: 1, max: 4, step: 0.25 });
export const CUTOUT_BRUSH_RADIUS = Object.freeze({ min: 2, max: 60, initial: 16 });

const HALF = 0.5;
const ZOOM_PRECISION = 100;
const MS_PER_SECOND = 1000;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/** Side by side from the ui-layout collapse breakpoint up, a drag split below it. */
export const resolveCutoutLayout = (width: number): CutoutLayout =>
  width >= LAYOUT_COLLAPSE_BREAKPOINT ? CutoutLayout.SideBySide : CutoutLayout.Split;

/** The largest box with the photo's aspect that fits inside `box`. */
export function fitStage(box: CutoutSize, image: CutoutSize): CutoutSize {
  if (image.width <= 0 || image.height <= 0 || box.width <= 0 || box.height <= 0) return { width: 0, height: 0 };
  const ratio = Math.min(box.width / image.width, box.height / image.height);
  return { width: Math.round(image.width * ratio), height: Math.round(image.height * ratio) };
}

export const splitAt = (x: number, width: number): number => (width > 0 ? clamp(x / width, 0, 1) : HALF);

export const stepZoom = (zoom: number, direction: number): number =>
  clamp(Math.round((zoom + direction * CUTOUT_ZOOM.step) * ZOOM_PRECISION) / ZOOM_PRECISION, CUTOUT_ZOOM.min, CUTOUT_ZOOM.max);

export const canStepZoom = (zoom: number, direction: number): boolean => stepZoom(zoom, direction) !== zoom;

/** Keeps a zoomed stage covering its frame: at most half the overflow each way. */
export function clampPan(pan: CutoutPoint, zoom: number, stage: CutoutSize): CutoutPoint {
  const maxX = (stage.width * (zoom - 1)) / 2;
  const maxY = (stage.height * (zoom - 1)) / 2;
  return { x: clamp(pan.x, -maxX, maxX) + 0, y: clamp(pan.y, -maxY, maxY) + 0 };
}

export const brushModeFor = (tool: CutoutTool): string | null => (tool === CutoutTool.Move ? null : tool);

export const clampBrushRadius = (radius: number): number =>
  clamp(Math.round(radius), CUTOUT_BRUSH_RADIUS.min, CUTOUT_BRUSH_RADIUS.max);

export const formatSeconds = (ms: number): string => (ms / MS_PER_SECOND).toFixed(1);
