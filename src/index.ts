/**
 * @dloizides/ui-media — themable RN-web media controls.
 *
 * Theme comes from the host's `FeedbackUiProvider` (@dloizides/ui-feedback),
 * buttons from @dloizides/ui-buttons. No strings of its own: every label is a prop.
 * The framing maths is also published framework-free at `@dloizides/ui-media/framing`.
 */
export * from './framing';

export { ImagePickerButton, resolvePickerView } from './ImagePickerButton/ImagePickerButton';
export type { ImagePickerButtonProps, ImagePickerLabels, PickerView } from './ImagePickerButton/ImagePickerButton';
export { ImagePickerStatus } from './ImagePickerButton/ImagePickerStatus';
export { useImageUpload, pickWebImage, DEFAULT_IMAGE_ACCEPT } from './ImagePickerButton/useImageUpload';
export type { UseImageUploadOptions, ImageUploadState } from './ImagePickerButton/useImageUpload';

export { PhotoFramingEditor } from './PhotoFramingEditor/PhotoFramingEditor';
export type {
  PhotoFramingEditorProps,
  PhotoFramingLabels,
  PhotoFramingPreviewArgs,
  FramingActionLabel,
} from './PhotoFramingEditor/types';
