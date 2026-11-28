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
export { showsSideAction } from './ImagePickerButton/showsSideAction';
export type { ImagePickerSideAction } from './ImagePickerButton/showsSideAction';
export { useImageUpload, pickWebImage, DEFAULT_IMAGE_ACCEPT } from './ImagePickerButton/useImageUpload';
export { pickWebFile } from './pickWebFile/pickWebFile';
export type { UseImageUploadOptions, ImageUploadState } from './ImagePickerButton/useImageUpload';

export { PhotoFramingEditor } from './PhotoFramingEditor/PhotoFramingEditor';
export { PhotoAnchor, resolvePhotoAnchor } from './PhotoFramingEditor/PhotoAnchor';
export type { PhotoAnchorLayout } from './PhotoFramingEditor/PhotoAnchor';
export { AnchoredPhoto } from './AnchoredPhoto/AnchoredPhoto';
export type { AnchoredPhotoProps } from './AnchoredPhoto/AnchoredPhoto';
export { useImageAspectRatio } from './AnchoredPhoto/useImageAspectRatio';
export { resolveAnchoredPhotoLayout } from './AnchoredPhoto/resolveAnchoredPhotoLayout';
export type { AnchoredPhotoLayout } from './AnchoredPhoto/resolveAnchoredPhotoLayout';
export type {
  PhotoFramingEditorProps,
  PhotoFramingLabels,
  PhotoFramingPreviewArgs,
  FramingActionLabel,
} from './PhotoFramingEditor/types';

export { FileDropArea } from './FileDropArea/FileDropArea';
export type { FileDropAreaProps } from './FileDropArea/FileDropArea';
export type { FileDropLabels } from './FileDropArea/types';
export { FileDropLayout } from './FileDropArea/FileDropLayout';
export { FilePreview } from './FileDropArea/FilePreview';
export type { FilePreviewProps } from './FileDropArea/FilePreview';
export { FilePreviewKind } from './FileDropArea/FilePreviewKind';
export { isAcceptedFile, firstFile, previewKindOf } from './FileDropArea/fileAccept';
export type { FileLike } from './FileDropArea/fileAccept';
export { pastedText } from './FileDropArea/pastedText';
export { readClipboardFile } from './FileDropArea/readClipboardFile';
export { readClipboardText } from './FileDropArea/readClipboardText';
export { useFileDrop } from './FileDropArea/useFileDrop';
export { canReadClipboardFiles } from './FileDropArea/canReadClipboardFiles';
export type { ClipboardEnv } from './FileDropArea/canReadClipboardFiles';
export { useCanPasteFiles } from './FileDropArea/useCanPasteFiles';
