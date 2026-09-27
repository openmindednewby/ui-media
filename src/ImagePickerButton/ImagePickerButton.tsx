/**
 * ImagePickerButton — one upload slot: pick an image, hand it to the consumer's
 * `upload` function, show idle / uploading / error / done.
 *
 * No network code and no copy of its own: the transport is a prop and every
 * string arrives through `labels`, so each portal passes its FM() keys.
 */
import React, { useCallback, useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import type { ButtonVariant } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { ImagePickerStatus } from './ImagePickerStatus';
import { DEFAULT_IMAGE_ACCEPT, pickWebImage, useImageUpload } from './useImageUpload';

export interface ImagePickerLabels {
  /** Button, idle: "Add photo". */
  pick: string;
  /** Button, uploading: "Uploading...". */
  uploading: string;
  /** Button, done: "Replace photo". */
  replace: string;
  /** Button, error: "Try again". */
  retry: string;
  /** Status line after a successful upload: "Photo saved". */
  done: string;
  /** Status line after a failure: "Upload failed". */
  error: string;
  /** Accessibility hint for the button: "Opens a file picker to choose an image". */
  hint: string;
}

export interface ImagePickerButtonProps<TFile = File, TResult = void> {
  /** Consumer transport; whatever it resolves with (e.g. the stored URL) goes to `onUploaded`. */
  upload: (file: TFile) => Promise<TResult>;
  /** Called with `upload`'s result once the slot is `done`. */
  onUploaded?: (result: TResult) => void;
  labels: ImagePickerLabels;
  testID: string;
  /** Defaults to the browser file dialog. Native consumers pass their own picker. */
  pickFile?: () => Promise<TFile | null>;
  /** `accept` for the default web picker. Default `image/*`. */
  accept?: string;
  /** Start in the `done` state (the slot already has an image). */
  hasImage?: boolean;
  onError?: (error: unknown) => void;
  /** Told on every state change — e.g. to disable the parent form's Save while uploading. */
  onStatusChange?: (status: ImagePickerStatus) => void;
  disabled?: boolean;
}

export interface PickerView {
  buttonLabel: string;
  variant: ButtonVariant;
  statusText: string | null;
  /** Paint the status line in the theme's error colour. */
  isError: boolean;
}

/** Pure status -> copy/variant mapping (unit-tested; the component only paints it). */
export function resolvePickerView(status: ImagePickerStatus, labels: ImagePickerLabels): PickerView {
  switch (status) {
    case ImagePickerStatus.Uploading:
      return { buttonLabel: labels.uploading, variant: 'outline', statusText: null, isError: false };
    case ImagePickerStatus.Error:
      return { buttonLabel: labels.retry, variant: 'danger', statusText: labels.error, isError: true };
    case ImagePickerStatus.Done:
      return { buttonLabel: labels.replace, variant: 'outline', statusText: labels.done, isError: false };
    default:
      return { buttonLabel: labels.pick, variant: 'primary', statusText: null, isError: false };
  }
}

const STATUS_GAP = 6;
const STATUS_FONT_SIZE = 13;

const styles = StyleSheet.create({
  root: { alignItems: 'flex-start', gap: STATUS_GAP },
  status: { fontSize: STATUS_FONT_SIZE },
});

export function ImagePickerButton<TFile = File, TResult = void>({
  upload,
  onUploaded,
  labels,
  testID,
  pickFile,
  accept = DEFAULT_IMAGE_ACCEPT,
  hasImage,
  onError,
  onStatusChange,
  disabled = false,
}: ImagePickerButtonProps<TFile, TResult>): React.ReactElement {
  const { theme } = useUi();
  // The default picker yields a DOM File; a consumer with another TFile supplies `pickFile`.
  const webPick = useCallback(() => pickWebImage(accept) as Promise<TFile | null>, [accept]);
  const { status, pick } = useImageUpload<TFile, TResult>({
    upload,
    pickFile: pickFile ?? webPick,
    hasImage,
    onError,
    onUploaded,
    onStatusChange,
  });
  const view = useMemo(() => resolvePickerView(status, labels), [status, labels]);
  const isUploading = status === ImagePickerStatus.Uploading;
  const statusColor = view.isError ? theme.semantic.error['500'] : theme.colors.textSecondary;

  return (
    <View style={styles.root} testID={testID}>
      <Button
        accessibilityHint={labels.hint}
        accessibilityLabel={view.buttonLabel}
        autoLoading={false}
        disabled={disabled || isUploading}
        label={view.buttonLabel}
        loading={isUploading}
        testID={`${testID}-button`}
        variant={view.variant}
        onPress={pick}
      />
      {view.statusText !== null ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.status, { color: statusColor }]}
          testID={`${testID}-status`}
        >
          {view.statusText}
        </Text>
      ) : null}
    </View>
  );
}
