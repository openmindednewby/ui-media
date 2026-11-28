import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import type { DropZoneProps } from './DropZone';
import { UploadGlyph } from './UploadGlyph';

const STRIP_HEIGHT = 56;
const TOUCH_MIN = 44;
const PAD_X = 12;
const PAD_Y = 4;
const RADIUS = 12;
const BORDER = 2;
const GAP = 8;
const LINE_GAP = 2;
const ICON_GAP = 10;
const TEXT_LINES = 2;
const PROMPT_SIZE = 15;
const HINT_SIZE = 13;
const ACCENT_STEP = '500';

const styles = StyleSheet.create({
  strip: { minHeight: STRIP_HEIGHT, paddingHorizontal: PAD_X, paddingVertical: PAD_Y, borderRadius: RADIUS, borderWidth: BORDER, gap: GAP, flexDirection: 'row', alignItems: 'stretch', width: '100%' },
  choose: { flex: 1, minHeight: TOUCH_MIN, minWidth: TOUCH_MIN, flexDirection: 'row', alignItems: 'center', gap: ICON_GAP },
  paste: { justifyContent: 'center' },
  lines: { flex: 1, minWidth: 0, justifyContent: 'center', gap: LINE_GAP },
  prompt: { fontSize: PROMPT_SIZE, fontWeight: '700' },
  hint: { fontSize: HINT_SIZE },
});

/** The empty drop target as one strip at least 56 px tall: icon and text (two lines at most each) form the Choose button; Paste, when `onPaste` is given, is the shared 44 px sm Button. */
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
        <UploadGlyph color={dragging ? accent : colors.textSecondary} testID={`${testID}-icon`} />
        <View style={styles.lines}>
          <Text numberOfLines={TEXT_LINES} style={[styles.prompt, { color: dragging ? accent : colors.text }]} testID={`${testID}-prompt`}>
            {dragging ? labels.dropPrompt : labels.prompt}
          </Text>
          <Text numberOfLines={TEXT_LINES} style={[styles.hint, { color: colors.textSecondary }]} testID={`${testID}-hint`}>{labels.hint}</Text>
        </View>
      </Pressable>
      {onPaste !== undefined && (
        <View style={styles.paste}>
          <Button accessibilityHint={labels.pasteHint} accessibilityLabel={labels.paste} label={labels.paste} size="sm" testID={`${testID}-paste`} variant="outline" onPress={onPaste} />
        </View>
      )}
    </View>
  );
};

export default CompactDropZone;
