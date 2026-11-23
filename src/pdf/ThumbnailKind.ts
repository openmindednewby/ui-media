const PDF_TYPE = 'application/pdf';
const IMAGE_PREFIX = 'image/';

export const enum ThumbnailKind {
  Pdf = 'pdf',
  Image = 'image',
  Other = 'other',
}

/** How a file of this MIME type is shown as a thumbnail: its first PDF page, the image itself, or a blank box. */
export function thumbnailKind(mimeType: string): ThumbnailKind {
  const type = mimeType.toLowerCase();
  if (type === PDF_TYPE) return ThumbnailKind.Pdf;
  return type.startsWith(IMAGE_PREFIX) ? ThumbnailKind.Image : ThumbnailKind.Other;
}
