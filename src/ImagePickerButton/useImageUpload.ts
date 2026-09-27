import { useCallback, useEffect, useRef, useState } from 'react';

import { ImagePickerStatus } from './ImagePickerStatus';

export const DEFAULT_IMAGE_ACCEPT = 'image/*';

/**
 * Opens the browser's file dialog for ONE file. Resolves `null` on cancel, and
 * where there is no DOM (native) — a native consumer passes its own `pickFile`.
 */
export function pickWebImage(accept: string = DEFAULT_IMAGE_ACCEPT): Promise<File | null> {
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

export interface UseImageUploadOptions<TFile> {
  /** Consumer-owned transport. Resolve = stored; reject = error state. No network code lives here. */
  upload: (file: TFile) => Promise<void>;
  /** Picks one file; `null` means the user cancelled. */
  pickFile: () => Promise<TFile | null>;
  /** Start in `done` when the slot already holds an image. */
  hasImage?: boolean;
  /** Told about a failed pick or upload (logging / toasts). */
  onError?: (error: unknown) => void;
}

export interface ImageUploadState {
  status: ImagePickerStatus;
  /** Pick then upload. A second call while one is in flight is ignored. */
  pick: () => Promise<void>;
}

/**
 * The upload slot's state machine: idle -> uploading -> done | error, and from
 * done or error back to uploading on the next pick. A cancelled pick leaves the
 * state as it was, so cancelling "Replace" does not wipe a finished upload.
 */
export function useImageUpload<TFile>({
  upload,
  pickFile,
  hasImage = false,
  onError,
}: UseImageUploadOptions<TFile>): ImageUploadState {
  const [status, setStatus] = useState<ImagePickerStatus>(
    hasImage ? ImagePickerStatus.Done : ImagePickerStatus.Idle,
  );
  const busy = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const settle = useCallback((next: ImagePickerStatus): void => {
    if (mounted.current) setStatus(next);
  }, []);

  const pick = useCallback(async (): Promise<void> => {
    if (busy.current) return;
    busy.current = true;
    try {
      const file = await pickFile();
      if (file === null) return;
      settle(ImagePickerStatus.Uploading);
      await upload(file);
      settle(ImagePickerStatus.Done);
    } catch (error) {
      settle(ImagePickerStatus.Error);
      onError?.(error);
    } finally {
      busy.current = false;
    }
  }, [pickFile, upload, onError, settle]);

  return { status, pick };
}
