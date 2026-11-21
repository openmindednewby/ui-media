import React, { useCallback, useRef } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { DropZone } from './DropZone';
import { isAcceptedFile } from './fileAccept';
import { FilePreview } from './FilePreview';
import { readClipboardFile } from './readClipboardFile';
import type { FileDropLabels } from './types';
import { useFileDrop } from './useFileDrop';
import { pickWebFile } from '../pickWebFile/pickWebFile';

const GAP = 12;
const ERROR_PAD = 12;
const ERROR_RADIUS = 10;
const ERROR_SIZE = 15;
const ERROR_STEP = '500';

const styles = StyleSheet.create({
  root: { gap: GAP, width: '100%' },
  error: { padding: ERROR_PAD, borderRadius: ERROR_RADIUS, borderWidth: 1 },
  errorText: { fontSize: ERROR_SIZE },
});

export interface FileDropAreaProps {
  labels: FileDropLabels;
  accept: readonly string[];
  file: File | null;
  onFile: (file: File) => void;
  onReject: (file: File) => void;
  onRemove: () => void;
  onPasteEmpty?: () => void;
  error?: string;
  testID: string;
}

/** Takes one file by drop, paste (Ctrl+V or the Paste button) or pick; previews it; rejects files outside `accept`. */
export const FileDropArea = ({ labels, accept, file, onFile, onReject, onRemove, onPasteEmpty, error, testID }: FileDropAreaProps): React.ReactElement => {
  const { theme } = useUi();
  const host = useRef<View>(null);
  const errorTone = theme.semantic.error[ERROR_STEP];

  const offer = useCallback((next: File): void => {
    if (isAcceptedFile(next, accept)) onFile(next);
    else onReject(next);
  }, [accept, onFile, onReject]);

  const dragging = useFileDrop(host, offer);

  const choose = useCallback((): void => {
    void pickWebFile(accept.join(',')).then((picked) => {
      if (picked !== null) offer(picked);
    });
  }, [accept, offer]);

  const paste = useCallback((): void => {
    void readClipboardFile().then((pasted) => {
      if (pasted !== null) offer(pasted);
      else onPasteEmpty?.();
    });
  }, [offer, onPasteEmpty]);

  return (
    <View ref={host} style={styles.root} testID={testID}>
      {error !== undefined && error !== '' && (
        <View accessibilityRole="alert" style={[styles.error, { borderColor: errorTone, backgroundColor: theme.colors.surface }]} testID={`${testID}-error`}>
          <Text style={[styles.errorText, { color: errorTone }]}>{error}</Text>
        </View>
      )}
      {file === null ? (
        <DropZone dragging={dragging} labels={labels} testID={`${testID}-zone`} onChoose={choose} onPaste={paste} />
      ) : (
        <FilePreview file={file} labels={labels} testID={`${testID}-preview`} onRemove={onRemove} />
      )}
    </View>
  );
};

export default FileDropArea;
