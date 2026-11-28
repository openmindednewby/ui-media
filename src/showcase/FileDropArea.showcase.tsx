import React from 'react';

import { StyleSheet, View } from 'react-native';

import { FeedbackUiProvider } from '@dloizides/ui-feedback';

import { FileDropArea } from '../FileDropArea/FileDropArea';
import { FileDropLayout } from '../FileDropArea/FileDropLayout';

import type { FeedbackTheme } from '@dloizides/ui-feedback';

const GAP = 16;
const ACCEPT = ['application/pdf', 'image/png', 'image/jpeg'];
const LABELS = {
  prompt: 'showcase.fileDrop.prompt',
  dropPrompt: 'showcase.fileDrop.dropPrompt',
  hint: 'showcase.fileDrop.hint',
  choose: 'showcase.fileDrop.choose',
  chooseHint: 'showcase.fileDrop.chooseHint',
  paste: 'showcase.fileDrop.paste',
  pasteHint: 'showcase.fileDrop.pasteHint',
  remove: 'showcase.fileDrop.remove',
  removeHint: 'showcase.fileDrop.removeHint',
  preview: 'showcase.fileDrop.preview',
};

const styles = StyleSheet.create({ column: { gap: GAP, width: '100%' } });

export interface FileDropAreaShowcaseProps {
  theme: FeedbackTheme;
}

/** Showcase story: the drop area in both layouts, the full box and the compact one-row strip. */
export const FileDropAreaShowcase = ({ theme }: FileDropAreaShowcaseProps): React.ReactElement => (
  <FeedbackUiProvider t={(key) => key} theme={theme}>
    <View style={styles.column}>
      <FileDropArea accept={ACCEPT} file={null} labels={LABELS} layout={FileDropLayout.Full} testID="file-drop-full" onFile={() => undefined} onReject={() => undefined} onRemove={() => undefined} />
      <FileDropArea accept={ACCEPT} file={null} labels={LABELS} layout={FileDropLayout.Compact} testID="file-drop-compact" onFile={() => undefined} onReject={() => undefined} onRemove={() => undefined} />
    </View>
  </FeedbackUiProvider>
);
