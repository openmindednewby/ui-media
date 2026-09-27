/**
 * Where the photo sits inside the preview frame. `Bottom` matches a kefi-landings
 * cut-out (`.amb-photo img`: 4:5, `object-fit: contain`, `object-position: center
 * bottom`) — feet on the floor of the card. An `as const` object rather than a TS
 * `const enum` for the same isolatedModules reason as FramingAction.
 */
export const PhotoAnchor = {
  Center: 'center',
  Bottom: 'bottom',
} as const;

export type PhotoAnchor = (typeof PhotoAnchor)[keyof typeof PhotoAnchor];

export interface PhotoAnchorLayout {
  /** Applied to the editor's preview column: where the consumer's card sits vertically. */
  justifyContent: 'center' | 'flex-end';
  /** CSS `object-position` the consumer spreads onto its `<img>` / RN-web image. */
  objectPosition: 'center center' | 'center bottom';
}

/** Pure anchor -> layout mapping (unit-tested; the editor only applies it). */
export function resolvePhotoAnchor(anchor: PhotoAnchor): PhotoAnchorLayout {
  return anchor === PhotoAnchor.Bottom
    ? { justifyContent: 'flex-end', objectPosition: 'center bottom' }
    : { justifyContent: 'center', objectPosition: 'center center' };
}
