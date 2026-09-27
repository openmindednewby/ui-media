/**
 * The four states of an image upload slot (KEFI-PEOPLE-1 design board "upload
 * slot"). An `as const` object, not a `const enum`, so Babel / isolatedModules
 * consumers can read it from the published .d.ts.
 */
export const ImagePickerStatus = {
  Idle: 'idle',
  Uploading: 'uploading',
  Error: 'error',
  Done: 'done',
} as const;

export type ImagePickerStatus = (typeof ImagePickerStatus)[keyof typeof ImagePickerStatus];
