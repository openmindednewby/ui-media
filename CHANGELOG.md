# Changelog

## 0.5.0

- `useImageUpload` / `ImagePickerButton`: `onStatusChange(status)` — told on every state change so a parent form can gate Save while an upload is in flight (KEFI-PEOPLE-1 T21 "Organizer people editor: frontend review fixes").

## 0.4.0

- KEFI-PEOPLE-1 T10d "Organizer people editor: anchored photo in the package": new `AnchoredPhoto` (`uri`, `anchor`, `framing`, `style`, `accessibilityLabel`, `testID`) paints a contained, framed photo anchored to the centre or bottom of its parent box. RN-web's Image ignores `object-position`, so the photo is sized to its measured aspect (`useImageAspectRatio`, exported) and placed by flexbox. Pure `resolveAnchoredPhotoLayout` exported. Moved out of kefi-web `PersonPhoto`.

## 0.3.0

- KEFI-PEOPLE-1 T10b "Organizer people editor: ui-media adoption gaps" (backwards compatible):
  - `ImagePickerButton` / `useImageUpload` take a second generic `TResult` (default `void`): `upload` returns `Promise<TResult>` and the new `onUploaded(result)` receives it once the slot is `done`. A throwing `onUploaded` does not flip the slot to error.
  - `PhotoFramingEditor` gains `anchor?: PhotoAnchor` (`center` default | `bottom`); `renderPreview` now also receives `anchor` and `objectPosition` (`center bottom` for kefi-landings `.amb-photo` cut-outs). New exports `PhotoAnchor`, `resolvePhotoAnchor`, `PhotoAnchorLayout`.

## 0.2.0

- KEFI-PEOPLE-1 T12 "Organizer people editor: shared photo framing": `PHOTO_FRAMING_BOUNDS`,
  `DEFAULT_PHOTO_FRAMING`, `clampFraming`, `isDefaultFraming` and the framing types are now
  re-exported from `@dloizides/site-template-kit/framing` (new dependency, no new peers) — the
  same module the kefi-landings renderer uses, so the two can no longer drift.

## 0.1.0

- Initial release: ImagePickerButton, useImageUpload, PhotoFramingEditor, PHOTO_FRAMING_BOUNDS + clampFraming (parity with kefi-landings photoTransform), framework-free ./framing subpath.
