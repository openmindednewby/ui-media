import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import type { DropZoneProps } from './DropZone';

const STRIP_HEIGHT = 56;
const TOUCH_MIN = 44;
const PAD_X = 12;
const PAD_Y = 4;
const RADIUS = 12;
const BORDER = 2;
const GAP = 8;
const LINE_GAP = 2;
const PROMPT_SIZE = 15;
const HINT_SIZE = 13;
const ACCENT_STEP = '500';

const styles = StyleSheet.create({
  strip: { minHeight: STRIP_HEIGHT, paddingHorizontal: PAD_X, paddingVertical: PAD_Y, borderRadius: RADIUS, borderWidth: BORDER, gap: GAP, flexDirection: 'row', alignItems: 'center', width: '100%' },
  choose: { flex: 1, minHeight: TOUCH_MIN, minWidth: TOUCH_MIN, justifyContent: 'center', gap: LINE_GAP },
  prompt: { fontSize: PROMPT_SIZE, fontWeight: '700' },
  hint: { fontSize: HINT_SIZE },
});

/** The empty drop target as one strip about 56 px tall: the whole text block is the Choose button, Paste sits at the end when `onPaste` is given. */
export const CompactDropZone = ({ labels, dragging, onChoose, onPaste, testID }: DropZoneProps): React.ReactElement => {
  const { theme } = useUi();
  const { colors } = theme;
  const accent = theme.palette.primary[ACCENT_STEP];

  return (
    <View
      style={[
        styles.strip,
        dragging
          ? { borderColor: accent, borderStyle: 'solid', backgroundColor: colors.surface }
          : { borderColor: colors.border, borderStyle: 'dashed', backgroundColor: colors.background },
      ]}
      testID={testID}
    >
      <Pressable accessibilityHint={labels.chooseHint} accessibilityLabel={labels.choose} accessibilityRole="button" style={styles.choose} testID={`${testID}-choose`} onPress={onChoose}>
        <Text numberOfLines={1} style={[styles.prompt, { color: dragging ? accent : colors.text }]} testID={`${testID}-prompt`}>
          {dragging ? labels.dropPrompt : labels.prompt}
        </Text>
        <Text numberOfLines={1} style={[styles.hint, { color: colors.textSecondary }]}>{labels.hint}</Text>
      </Pressable>
      {onPaste !== undefined && <Button accessibilityHint={labels.pasteHint} accessibilityLabel={labels.paste} label={labels.paste} testID={`${testID}-paste`} variant="outline" onPress={onPaste} />}
    </View>
  );
};

export default CompactDropZone;
