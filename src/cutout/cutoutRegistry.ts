export interface CutoutRequest {
  image: Blob;
  resolve: (cutout: Blob | null) => void;
}

type CutoutListener = (request: CutoutRequest | null) => void;

let listener: CutoutListener | null = null;
let current: CutoutRequest | null = null;

/** Called by `CutoutHost`; returns the unregister function. */
export function registerCutoutHost(next: CutoutListener): () => void {
  listener = next;
  return () => {
    if (listener !== next) return;
    current?.resolve(null);
    listener = null;
    current = null;
  };
}

/** Opens the Compare dialog for `image`; resolves the cut-out PNG, or null on Cancel. */
export function openCutout(image: Blob): Promise<Blob | null> {
  const host = listener;
  if (host === null) return Promise.reject(new Error('openCutout: mount a CutoutHost first'));
  current?.resolve(null);
  return new Promise<Blob | null>((resolvePromise) => {
    const request: CutoutRequest = {
      image,
      resolve: (cutout) => {
        if (current !== request) return;
        current = null;
        resolvePromise(cutout);
        host(null);
      },
    };
    current = request;
    host(request);
  });
}
