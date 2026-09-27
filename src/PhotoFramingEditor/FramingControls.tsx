/**
 * The editor's controls: a zoom stepper (minus, readout, plus) and a 3x3
 * position d-pad with reset in the middle. Every control is a 44px ui-buttons
 * IconButton, disabled when the press would change nothing (at a bound).
 */
import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';

import { FramingAction } from '../framing/FramingAction';
import type { PhotoFraming } from '../framing/photoFraming';
import type { PhotoFramingSteps } from '../framing/stepFraming';
import { canStepFraming } from '../framing/stepFraming';
import type { PhotoFramingLabels } from './types';

/** WCAG AA touch target; IconButton `md` is this size, the d-pad spacers match it. */
const TARGET = 44;
const GAP = 8;
const SECTION_GAP = 16;
const HEADING_SIZE = 13;
const READOUT_MIN_WIDTH = 56;
const READOUT_SIZE = 15;
const PERCENT = 100;

const DEFAULT_GLYPHS: Record<FramingAction, string> = {
  [FramingAction.ZoomIn]: '+',
  [FramingAction.ZoomOut]: '−',
  [FramingAction.MoveUp]: '↑',
  [FramingAction.MoveDown]: '↓',
  [FramingAction.MoveLeft]: '←',
  [FramingAction.MoveRight]: '→',
  [FramingAction.Reset]: '↺',
};

const styles = StyleSheet.create({
  root: { gap: SECTION_GAP },
  section: { gap: GAP },
  heading: { fontSize: HEADING_SIZE, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: GAP },
  readout: { minWidth: READOUT_MIN_WIDTH, textAlign: 'center', fontSize: READOUT_SIZE },
  spacer: { width: TARGET, height: TARGET },
});

interface FramingControlsProps {
  framing: PhotoFraming;
  steps?: PhotoFramingSteps;
  labels: PhotoFramingLabels;
  onAction: (action: FramingAction) => void;
  renderGlyph?: (action: FramingAction, color: string, size: number) => React.ReactNode;
  disabled: boolean;
  testID: string;
}

export const FramingControls = ({
  framing,
  steps,
  labels,
  onAction,
  renderGlyph,
  disabled,
  testID,
}: FramingControlsProps): React.ReactElement => {
  const { theme } = useUi();

  const control = (action: FramingAction): React.ReactElement => (
    <IconButton
      accessibilityHint={labels.actions[action].hint}
      actionLabel={labels.actions[action].label}
      autoLoading={false}
      disabled={disabled || !canStepFraming(framing, action, steps)}
      renderIcon={(color, size) =>
        renderGlyph ? (
          renderGlyph(action, color, size)
        ) : (
          <Text accessible={false} style={{ color, fontSize: size }}>
            {DEFAULT_GLYPHS[action]}
          </Text>
        )
      }
      showLabel={false}
      testID={`${testID}-${action}`}
      onPress={() => onAction(action)}
    />
  );
  const heading = { color: theme.colors.textSecondary };

  return (
    <View style={styles.root}>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={[styles.heading, heading]}>
          {labels.size}
        </Text>
        <View style={styles.row}>
          {control(FramingAction.ZoomOut)}
          <Text style={[styles.readout, { color: theme.colors.text }]} testID={`${testID}-scale`}>
            {labels.scaleValue(Math.round(framing.scale * PERCENT))}
          </Text>
          {control(FramingAction.ZoomIn)}
        </View>
      </View>
      <View style={styles.section}>
        <Text accessibilityRole="header" style={[styles.heading, heading]}>
          {labels.position}
        </Text>
        <View style={styles.row}>
          <View style={styles.spacer} />
          {control(FramingAction.MoveUp)}
          <View style={styles.spacer} />
        </View>
        <View style={styles.row}>
          {control(FramingAction.MoveLeft)}
          {control(FramingAction.Reset)}
          {control(FramingAction.MoveRight)}
        </View>
        <View style={styles.row}>
          <View style={styles.spacer} />
          {control(FramingAction.MoveDown)}
          <View style={styles.spacer} />
        </View>
      </View>
    </View>
  );
};
