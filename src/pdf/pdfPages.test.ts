import { createPdfPages } from './pdfPages';

import type { PdfJs } from './pdfPages';

function fakePdfJs(numPages: number, destroy: jest.Mock): PdfJs {
  const doc = { numPages, destroy };
  return { getDocument: () => ({ promise: Promise.resolve(doc) }) } as unknown as PdfJs;
}

describe('createPdfPages', () => {
  it('with a three page PDF, counts three pages and releases the document', async () => {
    const destroy = jest.fn(async () => Promise.resolve());
    const pages = createPdfPages(async () => Promise.resolve(fakePdfJs(3, destroy)));

    const count = await pages.countPdfPages(new Uint8Array([1]));

    expect({ count, destroyed: destroy.mock.calls.length }).toEqual({ count: 3, destroyed: 1 });
  });

  it('with two counts, loads pdf.js once', async () => {
    const destroy = jest.fn(async () => Promise.resolve());
    const load = jest.fn(async () => Promise.resolve(fakePdfJs(1, destroy)));
    const pages = createPdfPages(load);
    await pages.countPdfPages(new Uint8Array([1]));

    await pages.countPdfPages(new Uint8Array([1]));

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('with no count asked, never loads pdf.js', () => {
    const load = jest.fn(async () => Promise.resolve(fakePdfJs(1, jest.fn())));

    createPdfPages(load);

    expect(load).not.toHaveBeenCalled();
  });
});
