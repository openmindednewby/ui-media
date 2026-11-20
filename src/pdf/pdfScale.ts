export interface PageSize {
  scale: number;
  height: number;
}

/** The pdf.js scale that draws a page `cssWidth` px wide, sharp at `pixelRatio`, and its css height. */
export function pageSize(pageWidth: number, pageHeight: number, cssWidth: number, pixelRatio: number): PageSize {
  const fit = cssWidth / pageWidth;
  return { scale: fit * Math.max(1, pixelRatio), height: Math.round(pageHeight * fit) };
}
