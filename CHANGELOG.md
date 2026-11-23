# Changelog

## 0.16.0

- D-AWAY-INV-24 "Proof thumbnail on each row": `ProofThumbnail` in `@dloizides/ui-media/pdf`, a pressable fixed-size box showing a file's first PDF page (via `PdfPageImage`) or the image itself (blob URL, revoked on change/unmount), blank while bytes are null or the type is neither. Props: `bytes`, `mimeType`, `pages`, `width`, `height`, `label`, `hint`, `testID`, `onPress`. New pure `thumbnailKind(mimeType)` + `ThumbnailKind`.

## 0.15.0

- D-AWAY-INV-19 "A pasted bank link shows how to get the file": `FileDropArea` takes optional `onPasteText(text)`. Ctrl+V of text on the page (not into an input, textarea, select or contenteditable) and the Paste button when the clipboard holds no file but text both call it; without it the Paste button still calls `onPasteEmpty`. New pure `pastedText({ target, text })` and `readClipboardText()`.

## 0.14.1

- INV-BILLS-1 N3: `FileDropArea` shows its Paste button only where the browser can read a file from the clipboard (`navigator.clipboard.read` present, clipboard-read permission not denied, web only); Ctrl+V on the page keeps working everywhere. New pure `canReadClipboardFiles(env)` and hook `useCanPasteFiles()`. Props unchanged.

## 0.14.0

- INV-BILLS-1 D-BILLS-9 "Every Bills UI part is shared", UI-ATOMIC-1. New organism `FileDropArea`: takes one file by drop on the area, paste anywhere on the page (Ctrl+V) or the Paste button (`readClipboardFile`), or Choose (`pickWebFile`); files outside `accept` (MIME, `type/*` or `.ext`) go to `onReject`, the host shows its `error`; the chosen file previews as an image or its name with Remove. Molecules `DropZone`-internal and `FilePreview`; helpers `isAcceptedFile`, `firstFile`, `previewKindOf`, `useFileDrop`. Labels are props (`FileDropLabels`); web-first, on native Choose and Paste do nothing.

## 0.13.0

- INV-EXTRACT-1 W3 "PDF page preview": opt-in `@dloizides/ui-media/pdf` subpath (web). `PdfPageImage` draws one page of a PDF as an `<img>` (`fallback` while drawing, `failure` on error, blob URL revoked on unmount); `createPdfPages(load)` binds `countPdfPages` / `renderPdfPage` to a pdf.js loader the consumer supplies (its own lazy `import()` and worker URL), called once on first use, so pdf.js stays out of the main bundle. `pdfjs-dist` is an optional peer, used for types only. First consumer: invoice-web preview + template sheet.

## 0.11.0

- QR-SHARED-1 "One shared QR code renderer": opt-in `@dloizides/ui-media/qr` subpath with `QrCode` (react-native-svg, optional peer; colours and label are props) and the framework-free `buildQrGeometry(text)` (one SVG path, 4-module quiet zone) over `qrcode-generator`. First consumer: compliance-console S-33 "New verification"; kefi-web `ticketQr.ts` is the copy to switch.

## 0.10.0

- UIMEDIA-PICKER-VARIANT-1 "ImagePickerButton idle variant prop": opt-in `idleVariant?: ButtonVariant` sets the button variant while the slot is empty, for a secondary upload action. Default `primary`, so existing callers are unchanged; uploading, error and done keep their variants. `resolvePickerView` takes it as an optional third argument.

## 0.9.0

- BGREMOVE-1 "In-browser background removal for every app", visual-qa r2 MEDIUM: the cutout toolbar's zoom "+" no longer overlaps the Brush size slider at 1024+. The zoom steps are 44 px `IconButton`s (no 100 px `Button` floor) and the zoom cell basis is derived from its content (`zoomRowWidth`, `src/cutout/toolbarGeometry.ts`).
- `useImageUpload` follows `hasImage` after mount: a URL typed later moves the slot `idle` -> `done` (so the side action shows, disabled with `noFileHint`), clearing it moves `done` -> `idle` and drops the held file. An upload in flight is never overridden.

## 0.8.0

- BGREMOVE-1 "In-browser background removal for every app", owner decision D14: the `ImagePickerButton` side action now receives the image.
  - `ImagePickerSideAction<TFile = File>.onPress(file: TFile | null)`: the last successfully uploaded file, kept in the picker's state; `null` when the slot only holds an image from a URL (`hasImage`). Existing `() => void` handlers still type-check and behave as before.
  - New opt-in `noFileHint?: string`: when no file is held, the action is disabled and this hint is its accessibility hint. Without it the action stays enabled and gets `null`, as in 0.7.0.
  - `useImageUpload` returns `file: TFile | null`; `ImageUploadState<TFile = unknown>` is now generic. Pure `resolveSideAction(action, hasFile)` added beside `showsSideAction`.
  - No URL fetch inside the package: the picker has no network code, a cross-origin or authenticated image URL would fail on CORS or credentials, and the consumer already owns the URL and its transport.

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
