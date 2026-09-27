/**
 * Natural width / height of a remote image, or null until it is known (or the
 * size lookup fails). AnchoredPhoto needs it to anchor a contained photo: RN-web's
 * Image paints a centred background, so `object-position` cannot move it, but an
 * element sized to the photo's own aspect can be pushed to an edge by flexbox.
 */
import { useEffect, useState } from 'react';

import { Image } from 'react-native';

export function useImageAspectRatio(uri: string): number | null {
  const [measured, setMeasured] = useState<{ uri: string; ratio: number } | null>(null);

  useEffect(() => {
    if (uri === '') return undefined;
    let active = true;
    Image.getSize(
      uri,
      (width, height) => {
        if (active && width > 0 && height > 0) setMeasured({ uri, ratio: width / height });
      },
      () => undefined,
    );
    return () => {
      active = false;
    };
  }, [uri]);

  return measured?.uri === uri ? measured.ratio : null;
}
