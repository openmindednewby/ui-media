import React, { useCallback, useEffect, useRef } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';

import { CompactDropZone } from './CompactDropZone';
import { DropZone } from './DropZone';
import { isAcceptedFile } from './fileAccept';
import { FileDropLayout } from './FileDropLayout';
import { FilePreview } from './FilePreview';
import { readClipboardFile } from './readClipboardFile';
import { readClipboardText } from './readClipboardText';
import type { FileDropLabels } from './types';
import { useCanPasteFiles } from './useCanPasteFiles';
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
  onPasteText?: (text: string) => void;
  error?: string;
  autoFocusChoose?: boolean;
  layout?: FileDropLayout;
  testID: string;
}

interface FocusableHost {
  querySelector?: (selector: string) => { focus?: () => void } | null;
}

/** Takes one file by drop, paste (Ctrl+V or the Paste button) or pick; previews it; rejects files outside `accept`; pasted text goes to `onPasteText`. `autoFocusChoose` focuses Choose on mount (web); `layout` Compact is one ~56 px strip. */
export const FileDropArea = ({ labels, accept, file, onFile, onReject, onRemove, onPasteEmpty, onPasteText, error, autoFocusChoose = false, layout = FileDropLayout.Full, testID }: FileDropAreaProps): React.ReactElement => {
  const { theme } = useUi();
  const host = useRef<View>(null);
  const errorTone = theme.semantic.error[ERROR_STEP];
  const Zone = layout === FileDropLayout.Compact ? CompactDropZone : DropZone;

  const offer = useCallback((next: File): void => {
    if (isAcceptedFile(next, accept)) onFile(next);
    else onReject(next);
  }, [accept, onFile, onReject]);

  useEffect(() => {
    if (!autoFocusChoose) return;
    const node = host.current as unknown as FocusableHost | null;
    node?.querySelector?.(`[data-testid="${testID}-zone-choose"]`)?.focus?.();
  }, [autoFocusChoose, testID]);

  const dragging = useFileDrop(host, offer, onPasteText);
  const canPaste = useCanPasteFiles();

  const choose = useCallback((): void => {
    void pickWebFile(accept.join(',')).then((picked) => {
      if (picked !== null) offer(picked);
    });
  }, [accept, offer]);

  const paste = useCallback((): void => {
    void readClipboardFile().then((pasted) => {
      if (pasted !== null) {
        offer(pasted);
        return undefined;
      }
      return readClipboardText().then((text) => {
        if (text.trim() !== '' && onPasteText !== undefined) onPasteText(text);
        else onPasteEmpty?.();
      });
    });
  }, [offer, onPasteEmpty, onPasteText]);

  return (
    <View ref={host} style={styles.root} testID={testID}>
      {error !== undefined && error !== '' && (
        <View accessibilityRole="alert" style={[styles.error, { borderColor: errorTone, backgroundColor: theme.colors.surface }]} testID={`${testID}-error`}>
          <Text style={[styles.errorText, { color: errorTone }]}>{error}</Text>
        </View>
      )}
      {file === null ? (
        <Zone dragging={dragging} labels={labels} testID={`${testID}-zone`} onChoose={choose} onPaste={canPaste ? paste : undefined} />
      ) : (
        <FilePreview file={file} labels={labels} testID={`${testID}-preview`} onRemove={onRemove} />
      )}
    </View>
  );
};

export default FileDropArea;
