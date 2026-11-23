import { useEffect, useState } from 'react';

/** A blob URL for the bytes while they are shown, revoked when they change or unmount; null with no bytes or no blob URLs. */
export function useBytesUrl(bytes: Uint8Array | null, mimeType: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bytes === null || typeof URL.createObjectURL !== 'function') {
      setUrl(null);
      return undefined;
    }
    const next = URL.createObjectURL(new Blob([bytes.slice()], { type: mimeType }));
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [bytes, mimeType]);

  return url;
}
