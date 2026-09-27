/**
 * Where the photo sits inside its frame. `Bottom` is for cut-out portraits
 * (`object-fit: contain; object-position: center bottom`): feet on the floor of
 * the card.
 */
export const enum PhotoAnchor {
  Center = 'center',
  Bottom = 'bottom',
}

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
