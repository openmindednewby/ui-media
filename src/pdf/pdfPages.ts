import type * as PdfJsModule from 'pdfjs-dist';

import { pageSize } from './pdfScale';

export type PdfJs = typeof PdfJsModule;

export interface PageImage {
  url: string;
  height: number;
}

export interface PdfPages {
  countPdfPages: (bytes: Uint8Array) => Promise<number>;
  renderPdfPage: (bytes: Uint8Array, width: number, pixelRatio: number, pageNumber: number) => Promise<PageImage>;
}

async function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) reject(new Error('canvas produced no image'));
      else resolve(blob);
    }, 'image/png');
  });
}

/** Binds the page counter and page drawer to a pdf.js loader, called once on first use so pdf.js stays lazy. */
export function createPdfPages(load: () => Promise<PdfJs>): PdfPages {
  let pdfJs: Promise<PdfJs> | null = null;
  const loadPdfJs = async (): Promise<PdfJs> => {
    pdfJs ??= load();
    return pdfJs;
  };
  const countPdfPages = async (bytes: Uint8Array): Promise<number> => {
    const lib = await loadPdfJs();
    const doc = await lib.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
    try {
      return doc.numPages;
    } finally {
      await doc.destroy();
    }
  };
  const renderPdfPage = async (
    bytes: Uint8Array,
    width: number,
    pixelRatio: number,
    pageNumber: number
  ): Promise<PageImage> => {
    const lib = await loadPdfJs();
    const doc = await lib.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
    try {
      const page = await doc.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      const size = pageSize(base.width, base.height, width, pixelRatio);
      const viewport = page.getViewport({ scale: size.scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');
      if (context === null) throw new Error('canvas has no 2d context');
      await page.render({ canvasContext: context, viewport }).promise;
      return { url: URL.createObjectURL(await canvasBlob(canvas)), height: size.height };
    } finally {
      await doc.destroy();
    }
  };
  return { countPdfPages, renderPdfPage };
}
