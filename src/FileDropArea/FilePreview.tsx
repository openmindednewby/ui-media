import React from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { FilePreviewKind } from './FilePreviewKind';
import { previewKindOf } from './fileAccept';
import type { FileDropLabels } from './types';
import { useObjectUrl } from './useObjectUrl';

const PREVIEW_HEIGHT = 260;
const PAD = 16;
const RADIUS = 12;
const GAP = 12;
const NAME_SIZE = 15;

const styles = StyleSheet.create({
  box: { padding: PAD, borderRadius: RADIUS, gap: GAP, alignItems: 'center', width: '100%' },
  image: { width: '100%', height: PREVIEW_HEIGHT },
  name: { fontSize: NAME_SIZE, fontWeight: '600', textAlign: 'center' },
});

export interface FilePreviewProps {
  file: File;
  labels: FileDropLabels;
  onRemove: () => void;
  testID: string;
}

/** The chosen file: an image preview or the file name, with a remove button. */
export const FilePreview = ({ file, labels, onRemove, testID }: FilePreviewProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const url = useObjectUrl(file);
  const showImage = previewKindOf(file.type) === FilePreviewKind.Image && url !== null;

  return (
    <View style={[styles.box, { backgroundColor: colors.surface }]} testID={testID}>
      {showImage ? (
        <Image accessibilityLabel={labels.preview} resizeMode="contain" source={{ uri: url }} style={styles.image} testID={`${testID}-image`} />
      ) : (
        <Text style={[styles.name, { color: colors.text }]} testID={`${testID}-name`}>{file.name}</Text>
      )}
      <Button
        accessibilityHint={labels.removeHint}
        accessibilityLabel={labels.remove}
        label={labels.remove}
        testID={`${testID}-remove`}
        variant="outline"
        onPress={onRemove}
      />
    </View>
  );
};

export default FilePreview;
