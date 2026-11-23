import { fireEvent, render, screen } from '@testing-library/react';

import { ProofThumbnail } from './ProofThumbnail';
import { thumbnailKind, ThumbnailKind } from './ThumbnailKind';

import type { PdfPages } from './pdfPages';

const BYTES = new Uint8Array([1, 2, 3]);

function pagesDrawing(url: string): PdfPages {
  return { countPdfPages: async () => Promise.resolve(1), renderPdfPage: async () => Promise.resolve({ url, height: 120 }) };
}

function renderThumb(bytes: Uint8Array | null, mimeType: string, onPress = jest.fn()): jest.Mock {
  render(
    <ProofThumbnail
      bytes={bytes}
      height={100}
      hint="Opens the proof"
      label="Open receipt.pdf"
      mimeType={mimeType}
      pages={pagesDrawing('blob:page-1')}
      testID="thumb"
      width={72}
      onPress={onPress}
    />
  );
  return onPress;
}

describe('thumbnailKind', () => {
  it('with a PDF type in any case, returns Pdf', () => {
    const kind = thumbnailKind('Application/PDF');

    expect(kind).toBe(ThumbnailKind.Pdf);
  });

  it('with an image type, returns Image', () => {
    const kind = thumbnailKind('image/png');

    expect(kind).toBe(ThumbnailKind.Image);
  });

  it('with any other type, returns Other', () => {
    const kind = thumbnailKind('text/plain');

    expect(kind).toBe(ThumbnailKind.Other);
  });
});

describe('ProofThumbnail', () => {
  beforeEach(() => {
    Object.assign(URL, { createObjectURL: jest.fn(() => 'blob:image-1'), revokeObjectURL: jest.fn() });
  });

  it('when pressed, calls onPress once', () => {
    const onPress = renderThumb(null, 'application/pdf');

    fireEvent.click(screen.getByTestId('thumb'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('with image bytes, shows the image from its object URL', async () => {
    renderThumb(BYTES, 'image/png');

    const img = await screen.findByTestId('thumb-image');

    expect(img.getAttribute('src')).toBe('blob:image-1');
  });

  it('with PDF bytes, shows the drawn first page', async () => {
    renderThumb(BYTES, 'application/pdf');

    const page = await screen.findByTestId('thumb-page');

    expect(page.getAttribute('src')).toBe('blob:page-1');
  });

  it('with no bytes yet, shows the blank box', () => {
    renderThumb(null, 'image/png');

    const blank = screen.queryByTestId('thumb-blank');

    expect(blank).not.toBeNull();
  });
});
