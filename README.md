# @dloizides/ui-media

Themable React Native (RN-web) media controls for the dloizides.com UI kit.

- `ImagePickerButton` - one upload slot: idle / uploading / error / done. You pass the `upload(file)` function; the package has no network code. Default picker is the browser file dialog; pass `pickFile` on native.
- `PhotoFramingEditor` - live preview of your own card (`renderPreview({ framing, transform })`), zoom stepper and position d-pad (44px ui-buttons IconButtons). Value `{ x, y, scale }`.
- `PHOTO_FRAMING_BOUNDS`, `clampFraming`, `stepFraming`, `framingToTransform` - also importable from the framework-free `@dloizides/ui-media/framing` subpath (no react / react-native import).

All strings arrive through `labels` props (pass your FM() keys). Theme comes from `FeedbackUiProvider` (@dloizides/ui-feedback).

Peers: react, react-native, @dloizides/ui-buttons, @dloizides/ui-feedback, @dloizides/ui-layout.

## PDF page preview (`@dloizides/ui-media/pdf`, web)

```tsx
import { createPdfPages, PdfPageImage } from '@dloizides/ui-media/pdf';

export const pdfPages = createPdfPages(async () => {
  const [lib, worker] = await Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')]);
  lib.GlobalWorkerOptions.workerSrc = worker.default;
  return lib;
});

<PdfPageImage pages={pdfPages} bytes={bytes} width={320} label="Page 1" testID="page-1"
  borderColor={theme.colors.border} fallback={<Blank />} failure={<Blank />} />;
```

The loader runs once, on the first count or draw, so pdf.js and its worker stay in a lazy chunk. `pdfjs-dist` is an optional peer (types only).
