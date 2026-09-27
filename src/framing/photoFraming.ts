/**
 * Photo framing: the `{x, y, scale}` an organiser sets on a performer card.
 *
 * The bounds, default, clamp and identity check come from
 * `@dloizides/site-template-kit/framing` — the same module the kefi-landings
 * renderer builds its `--photo-tf` CSS from (KEFI-PEOPLE-1 T12 "Organizer people
 * editor: shared photo framing"). One copy, so the editor can never offer a value
 * the landing page would silently clamp away.
 *
 * That subpath imports nothing (no ajv, no JSON Schema), so this file stays
 * framework-free: it backs the `@dloizides/ui-media/framing` subpath.
 */
import type { PhotoFraming } from '@dloizides/site-template-kit/framing';

export {
  PHOTO_FRAMING_BOUNDS,
  DEFAULT_PHOTO_FRAMING,
  clampFraming,
  isDefaultFraming,
} from '@dloizides/site-template-kit/framing';
export type { PhotoFraming, PhotoFramingInput } from '@dloizides/site-template-kit/framing';

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
