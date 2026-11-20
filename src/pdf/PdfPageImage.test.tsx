import { render, screen, waitFor } from '@testing-library/react';

import { PdfPageImage } from './PdfPageImage';

import type { PageImage, PdfPages } from './pdfPages';

function pagesDrawing(draw: () => Promise<PageImage>): PdfPages {
  return { countPdfPages: async () => Promise.resolve(1), renderPdfPage: draw };
}

function renderPage(pages: PdfPages, onFailed?: () => void): ReturnType<typeof render> {
  return render(
    <PdfPageImage
      borderColor="currentColor"
      bytes={new Uint8Array([1])}
      failure={<span>failure</span>}
      fallback={<span>fallback</span>}
      label="page one"
      pages={pages}
      testID="page-1"
      width={300}
      onFailed={onFailed}
    />
  );
}

describe('PdfPageImage', () => {
  const revoke = jest.fn();

  beforeEach(() => {
    revoke.mockReset();
    Object.assign(URL, { revokeObjectURL: revoke });
  });

  it('with a draw that rejects, shows the failure element and reports it', async () => {
    const onFailed = jest.fn();

    renderPage(pagesDrawing(async () => Promise.reject(new Error('worker failed'))), onFailed);

    await waitFor(() => expect(screen.getByText('failure')).toBeTruthy());
    expect(onFailed).toHaveBeenCalledTimes(1);
  });

  it('with a draw that resolves, shows the page image at its drawn height', async () => {
    const image = { url: 'blob:page-1', height: 421 };

    renderPage(pagesDrawing(async () => Promise.resolve(image)));

    const img = await screen.findByTestId('page-1');
    expect({ src: img.getAttribute('src'), height: img.getAttribute('height') }).toEqual({ src: 'blob:page-1', height: '421' });
  });

  it('with a drawn page unmounted, revokes its image URL', async () => {
    const view = renderPage(pagesDrawing(async () => Promise.resolve({ url: 'blob:page-2', height: 10 })));
    await screen.findByTestId('page-1');

    view.unmount();

    expect(revoke).toHaveBeenCalledWith('blob:page-2');
  });
});
