import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

import { firstFile } from './fileAccept';
import { pastedText } from './pastedText';

function asElement(node: unknown): HTMLElement | null {
  const el = node as HTMLElement | null;
  return el !== null && typeof el.addEventListener === 'function' ? el : null;
}

/** Web: offers a file dropped on the host or pasted anywhere on the page, and pasted page text to `offerText`; true while a drag is over. */
export function useFileDrop(host: RefObject<unknown>, offer: (file: File) => void, offerText?: (text: string) => void): boolean {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = asElement(host.current);
    if (el === null || typeof document === 'undefined') return undefined;
    const over = (event: DragEvent): void => {
      event.preventDefault();
      setDragging(true);
    };
    const leave = (): void => setDragging(false);
    const drop = (event: DragEvent): void => {
      event.preventDefault();
      setDragging(false);
      const file = firstFile(event.dataTransfer?.files);
      if (file !== null) offer(file);
    };
    const paste = (event: ClipboardEvent): void => {
      const file = firstFile(event.clipboardData?.files);
      if (file === null) {
        const data = event.clipboardData;
        const text = pastedText({ target: event.target, text: typeof data?.getData === 'function' ? data.getData('text/plain') : '' });
        if (text !== '') offerText?.(text);
        return;
      }
      event.preventDefault();
      offer(file);
    };
    el.addEventListener('dragover', over);
    el.addEventListener('dragleave', leave);
    el.addEventListener('drop', drop);
    document.addEventListener('paste', paste);
    return () => {
      el.removeEventListener('dragover', over);
      el.removeEventListener('dragleave', leave);
      el.removeEventListener('drop', drop);
      document.removeEventListener('paste', paste);
    };
  }, [host, offer, offerText]);

  return dragging;
}
