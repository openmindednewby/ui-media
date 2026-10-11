/**
 * Opens the browser's file dialog for ONE file of any type matching `accept`.
 * Resolves `null` on cancel, and where there is no DOM (native).
 */
export function pickWebFile(accept: string): Promise<File | null> {
  if (typeof document === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null), { once: true });
    input.addEventListener('cancel', () => resolve(null), { once: true });
    input.click();
  });
}
