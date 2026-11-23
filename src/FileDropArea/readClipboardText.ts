/** Reads the clipboard's plain text; empty when there is none or reading is refused. */
export async function readClipboardText(): Promise<string> {
  const clip = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
  if (clip === undefined || typeof clip.readText !== 'function') return '';
  try {
    return await clip.readText();
  } catch {
    return '';
  }
}
