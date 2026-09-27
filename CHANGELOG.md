# Changelog

## 0.2.0

- KEFI-PEOPLE-1 T12 "Organizer people editor: shared photo framing": `PHOTO_FRAMING_BOUNDS`,
  `DEFAULT_PHOTO_FRAMING`, `clampFraming`, `isDefaultFraming` and the framing types are now
  re-exported from `@dloizides/site-template-kit/framing` (new dependency, no new peers) — the
  same module the kefi-landings renderer uses, so the two can no longer drift.

## 0.1.0

- Initial release: ImagePickerButton, useImageUpload, PhotoFramingEditor, PHOTO_FRAMING_BOUNDS + clampFraming (parity with kefi-landings photoTransform), framework-free ./framing subpath.
