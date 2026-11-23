const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

interface PasteSource {
  target: unknown;
  text: string;
}

function isEditable(target: unknown): boolean {
  const el = target as { tagName?: string; isContentEditable?: boolean } | null;
  if (el === null || typeof el !== 'object') return false;
  return el.isContentEditable === true || EDITABLE_TAGS.has(el.tagName ?? '');
}

/** The text a page paste offers the drop area; empty when it went into a field or holds only whitespace. */
export function pastedText({ target, text }: PasteSource): string {
  return isEditable(target) || text.trim() === '' ? '' : text;
}
