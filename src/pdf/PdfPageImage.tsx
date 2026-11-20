import React, { useEffect, useState } from 'react';

import { drawPage, PAGE_DRAWING } from './drawPage';
import { PageDrawStatus } from './PageDrawStatus';

import type { PageDraw } from './drawPage';
import type { PdfPages } from './pdfPages';

const FIRST_PAGE = 1;
const IMAGE_STYLE = { display: 'block', borderWidth: 1, borderStyle: 'solid' } as const;

export interface PdfPageImageProps {
  pages: PdfPages;
  bytes: Uint8Array;
  width: number;
  label: string;
  testID: string;
  borderColor: string;
  page?: number;
  fallback: React.ReactElement;
  failure: React.ReactElement;
  onFailed?: () => void;
}

/** One page of a PDF, the first by default, drawn as an image; `fallback` while it is drawn, `failure` if drawing fails. */
export const PdfPageImage = ({
  pages,
  bytes,
  width,
  label,
  testID,
  borderColor,
  page = FIRST_PAGE,
  fallback,
  failure,
  onFailed,
}: PdfPageImageProps): React.ReactElement => {
  const [draw, setDraw] = useState<PageDraw>(PAGE_DRAWING);
  useEffect(() => {
    let alive = true;
    let made: string | null = null;
    drawPage(async () => pages.renderPdfPage(bytes, width, window.devicePixelRatio, page))
      .then((settled) => {
        made = settled.image?.url ?? null;
        if (alive && settled.status === PageDrawStatus.Failed) onFailed?.();
        if (alive) setDraw(settled);
        else if (made !== null) URL.revokeObjectURL(made);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      if (made !== null) URL.revokeObjectURL(made);
    };
  }, [bytes, onFailed, page, pages, width]);
  if (draw.status === PageDrawStatus.Failed) return failure;
  if (draw.image === null) return fallback;
  return (
    <img
      alt={label}
      data-testid={testID}
      height={draw.image.height}
      src={draw.image.url}
      style={{ ...IMAGE_STYLE, borderColor }}
      width={width}
    />
  );
};
