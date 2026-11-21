import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import type { FileDropLabels } from './types';

const PAD = 20;
const RADIUS = 12;
const BORDER = 2;
const GAP = 10;
const PROMPT_SIZE = 17;
const HINT_SIZE = 14;
const ACCENT_STEP = '500';

const styles = StyleSheet.create({
  zone: { padding: PAD, borderRadius: RADIUS, borderWidth: BORDER, gap: GAP, alignItems: 'center', width: '100%' },
  prompt: { fontSize: PROMPT_SIZE, fontWeight: '700', textAlign: 'center' },
  hint: { fontSize: HINT_SIZE, textAlign: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: GAP },
});

export interface DropZoneProps {
  labels: FileDropLabels;
  dragging: boolean;
  onChoose: () => void;
  onPaste?: () => void;
  testID: string;
}

/** The empty drop target: a dashed box with the prompt, the accepted kinds and Choose / Paste buttons; Paste only when `onPaste` is given. */
export const DropZone = ({ labels, dragging, onChoose, onPaste, testID }: DropZoneProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const accent = theme.palette.primary[ACCENT_STEP];

  return (
    <View
      style={[
        styles.zone,
        dragging
          ? { borderColor: accent, borderStyle: 'solid', backgroundColor: colors.surface }
          : { borderColor: colors.border, borderStyle: 'dashed', backgroundColor: colors.background },
      ]}
      testID={testID}
    >
      <Text style={[styles.prompt, { color: dragging ? accent : colors.text }]} testID={`${testID}-prompt`}>
        {dragging ? labels.dropPrompt : labels.prompt}
      </Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>{labels.hint}</Text>
      <View style={styles.actions}>
        <Button accessibilityHint={labels.chooseHint} accessibilityLabel={labels.choose} label={labels.choose} testID={`${testID}-choose`} variant="outline" onPress={onChoose} />
        {onPaste !== undefined && <Button accessibilityHint={labels.pasteHint} accessibilityLabel={labels.paste} label={labels.paste} testID={`${testID}-paste`} variant="outline" onPress={onPaste} />}
      </View>
    </View>
  );
};

export default DropZone;
