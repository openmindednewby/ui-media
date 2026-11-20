import { PageDrawStatus } from './PageDrawStatus';

import type { PageImage } from './pdfPages';

export interface PageDraw {
  status: PageDrawStatus;
  image: PageImage | null;
}

export const PAGE_DRAWING: PageDraw = { status: PageDrawStatus.Drawing, image: null };

/** Runs `draw` and settles to Drawn with its image, or Failed when drawing throws. */
export async function drawPage(draw: () => Promise<PageImage>): Promise<PageDraw> {
  try {
    return { status: PageDrawStatus.Drawn, image: await draw() };
  } catch {
    return { status: PageDrawStatus.Failed, image: null };
  }
}
