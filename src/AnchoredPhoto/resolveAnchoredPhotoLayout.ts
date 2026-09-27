import { PhotoAnchor, resolvePhotoAnchor } from '../PhotoFramingEditor/PhotoAnchor';
import type { PhotoAnchorLayout } from '../PhotoFramingEditor/PhotoAnchor';

export interface AnchoredPhotoLayout {
  /** Main-axis placement of the photo inside its full-box frame. */
  justifyContent: PhotoAnchorLayout['justifyContent'];
  /**
   * `null` = fill the box (size unknown yet, image stays centred by `contain`);
   * a number = size the image to that width / height so the frame can anchor it.
   */
  aspectRatio: number | null;
}

/** Pure anchor + measured aspect -> layout (unit-tested; AnchoredPhoto only paints it). */
export function resolveAnchoredPhotoLayout(
  anchor: PhotoAnchor,
  aspectRatio: number | null,
): AnchoredPhotoLayout {
  const { justifyContent } = resolvePhotoAnchor(anchor);
  const usable = aspectRatio !== null && Number.isFinite(aspectRatio) && aspectRatio > 0;
  return { justifyContent, aspectRatio: usable ? aspectRatio : null };
}
