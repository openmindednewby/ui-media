# Changelog

## 0.7.0

- BGREMOVE-1 "In-browser background removal for every app" AC-5 wave A (all opt-in, no behaviour change by default):
  - New subpath `@dloizides/ui-media/cutout`: `CutoutHost` (mount once; props `engine`, `labels`) and `openCutout(image: Blob): Promise<Blob | null>`, the Compare dialog: side by side from 768 px, drag split below; Keep / Erase / Move brush, zoom, brush size, Use cut-out / Cancel; progress + disabled controls while the model runs. `engine` is structural (`removeBackground`, `attachRefineBrush`, `encodeCutout` from `@dloizides/background-removal`), so the main entry gains no dependency. `@dloizides/ui-forms` >= 1.20.0 is an optional peer used only by the subpath.
  - `ImagePickerButton`: `removeBackground?: ImagePickerSideAction` renders a secondary button beside the pick button once the slot is `done`. Pure `showsSideAction` exported.
  - `PhotoFramingEditor`: `dragToPan?: boolean` pans the photo by mouse / touch drag on the preview; `labels.dragHint` is its accessibility hint. Pure `panFraming(start, {dx, dy}, box)` on the framework-free `./framing` subpath.

## 0.6.0

- New `pickWebFile(accept)`: opens the browser file dialog for one file of any type (web only, `null` on cancel or native). `pickWebImage` now delegates to it, behaviour unchanged (RUPEP-5 "Upload the RuPEP file from the Jobs tab").

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
