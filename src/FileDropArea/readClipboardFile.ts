const PASTED_FILE_STEM = 'pasted';
const IMAGE_PREFIX = 'image/';
const PDF_TYPE = 'application/pdf';

function isFileType(type: string): boolean {
  return type.startsWith(IMAGE_PREFIX) || type === PDF_TYPE;
}

/** Reads the first image or PDF on the clipboard as a File; null when there is none or reading is refused. */
export async function readClipboardFile(): Promise<File | null> {
  const clip = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
  if (clip === undefined || typeof clip.read !== 'function') return null;
  try {
    const items = await clip.read();
    const item = items.find((entry) => entry.types.some(isFileType));
    const type = item?.types.find(isFileType);
    if (item === undefined || type === undefined) return null;
    const blob = await item.getType(type);
    return new File([blob], `${PASTED_FILE_STEM}.${type.split('/')[1] ?? ''}`, { type });
  } catch {
    return null;
  }
}
