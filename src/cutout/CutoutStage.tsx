import React, { useCallback } from 'react';

import { Image, StyleSheet, Text, View } from 'react-native';

import { useUi } from '@dloizides/ui-feedback';
import { MIN_TARGET_PX } from '@dloizides/ui-layout';

import { BrushCanvas } from './BrushCanvas';
import { CutoutLayout } from './CutoutLayout';
import type { CutoutPoint, CutoutSize } from './cutoutMath';
import { brushModeFor } from './cutoutMath';
import { CutoutTool } from './CutoutTool';
import type { CutoutCut, CutoutEngine, CutoutLabels } from './types';
import { useStageGestures } from './useStageGestures';

const GAP = 12;
const RADIUS = 10;
const LABEL_SIZE = 13;
const CHIP_PAD = 8;
const HANDLE = MIN_TARGET_PX;
const HALF = 2;
const SPLIT_STEP = 0.1;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: GAP, justifyContent: 'center' },
  pane: { gap: CHIP_PAD },
  label: { fontSize: LABEL_SIZE, fontWeight: '600' },
  frame: { borderRadius: RADIUS, borderWidth: 1, overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, left: 0 },
  clip: { position: 'absolute', top: 0, bottom: 0, overflow: 'hidden' },
  chip: { position: 'absolute', top: CHIP_PAD, paddingHorizontal: CHIP_PAD, borderRadius: RADIUS },
  handle: { position: 'absolute', width: HANDLE, height: HANDLE, borderRadius: HANDLE / HALF, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});

export interface CutoutStageProps {
  engine: CutoutEngine;
  cut: CutoutCut;
  imageUri: string;
  layout: CutoutLayout;
  stage: CutoutSize;
  tool: CutoutTool;
  radius: number;
  zoom: number;
  pan: CutoutPoint;
  onPan: (pan: CutoutPoint) => void;
  split: number;
  onSplit: (split: number) => void;
  labels: CutoutLabels;
  testID: string;
}

export const CutoutStage = (props: CutoutStageProps): React.ReactElement => {
  const { engine, cut, imageUri, layout, stage, tool, radius, zoom, pan, split, onSplit, labels, testID } = props;
  const { theme } = useUi();
  const gestures = useStageGestures(props);
  const getMode = useCallback(() => brushModeFor(tool) ?? CutoutTool.Keep, [tool]);
  const getRadius = useCallback(() => radius, [radius]);
  const moving = tool === CutoutTool.Move;
  const sizeStyle = { width: stage.width, height: stage.height };
  const frame = [styles.frame, sizeStyle, { borderColor: theme.colors.border }];
  const zoomed = [styles.fill, sizeStyle, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoom }] }];
  const label = [styles.label, { color: theme.colors.textSecondary }];
  const splitX = layout === CutoutLayout.Split ? split * stage.width : 0;
  const panLayer = moving ? <View {...gestures.panHandlers} style={[styles.fill, sizeStyle]} testID={`${testID}-pan`} /> : null;
  const photo = <Image accessibilityIgnoresInvertColors source={{ uri: imageUri }} style={[styles.fill, sizeStyle]} />;
  const cutLayer = (
    <View style={[styles.fill, sizeStyle, { backgroundColor: theme.colors.border }]}>
      <BrushCanvas active={!moving} cut={cut} engine={engine} getMode={getMode} getRadius={getRadius} left={-splitX} size={stage} testID={`${testID}-canvas`} />
    </View>
  );

  if (layout === CutoutLayout.SideBySide)
    return (
      <View style={styles.row}>
        <View style={styles.pane}>
          <Text style={label}>{labels.original}</Text>
          <View style={frame}><View style={zoomed}>{photo}</View></View>
        </View>
        <View style={styles.pane}>
          <Text style={label}>{labels.cutout}</Text>
          <View style={frame} testID={`${testID}-cutout`}><View style={zoomed}>{cutLayer}</View>{panLayer}</View>
        </View>
      </View>
    );

  const adjust = (direction: number): void => onSplit(Math.min(1, Math.max(0, split + direction * SPLIT_STEP)));
  const chip = [styles.chip, { backgroundColor: theme.colors.surface }];
  return (
    <View style={[frame, { alignSelf: 'center' }]} testID={`${testID}-cutout`}>
      <View style={zoomed}>{photo}</View>
      <View style={[styles.clip, { left: splitX, width: stage.width - splitX }]}>
        <View style={zoomed}>{cutLayer}</View>
      </View>
      {panLayer}
      <Text style={[chip, label, { left: CHIP_PAD }]}>{labels.original}</Text>
      <Text style={[chip, label, { right: CHIP_PAD }]}>{labels.cutout}</Text>
      <View
        {...gestures.splitHandlers}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        accessibilityHint={labels.split.hint}
        accessibilityLabel={labels.split.label}
        accessibilityRole="adjustable"
        accessible
        style={[styles.handle, { left: splitX - HANDLE / HALF, top: stage.height / HALF - HANDLE / HALF, backgroundColor: theme.colors.surface, borderColor: theme.colors.text }]}
        testID={`${testID}-split`}
        onAccessibilityAction={(event) => adjust(event.nativeEvent.actionName === 'increment' ? 1 : -1)}
      >
        <Text accessible={false} style={{ color: theme.colors.text }}>{'↔'}</Text>
      </View>
    </View>
  );
};
