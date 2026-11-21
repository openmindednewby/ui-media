import { useEffect, useState } from 'react';

/** A blob URL for the file while it is shown, revoked when it changes or unmounts; null where blob URLs are unavailable. */
export function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file === null || typeof URL.createObjectURL !== 'function') {
      setUrl(null);
      return undefined;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);

  return url;
}
