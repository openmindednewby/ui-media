/**
 * The seven controls of the framing editor. An `as const` object rather than a
 * TS `const enum`: a const enum shipped in a .d.ts cannot be read by consumers
 * compiled with `isolatedModules` (every Expo / Babel portal).
 */
export const FramingAction = {
  ZoomIn: 'zoomIn',
  ZoomOut: 'zoomOut',
  MoveUp: 'moveUp',
  MoveDown: 'moveDown',
  MoveLeft: 'moveLeft',
  MoveRight: 'moveRight',
  Reset: 'reset',
} as const;

export type FramingAction = (typeof FramingAction)[keyof typeof FramingAction];
