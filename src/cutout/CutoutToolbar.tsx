import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { useUi } from '@dloizides/ui-feedback';
import { Field, FormCell, FormGrid } from '@dloizides/ui-forms';
import { MIN_TARGET_PX } from '@dloizides/ui-layout';

import { CUTOUT_BRUSH_RADIUS, canStepZoom, clampBrushRadius } from './cutoutMath';
import { CutoutTool } from './CutoutTool';
import type { CutoutControlLabel, CutoutLabels } from './types';

const GAP = 8;
const READOUT_WIDTH = 52;
const PERCENT = 100;
const TOOL_CELL = 220;
const ZOOM_CELL = 150;
const SIZE_CELL = 200;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: GAP, minHeight: MIN_TARGET_PX },
  grow: { flexGrow: 1, flexBasis: 0 },
  readout: { minWidth: READOUT_WIDTH, textAlign: 'center' },
  slider: { minHeight: MIN_TARGET_PX, flexGrow: 1, borderWidth: 1, borderRadius: GAP, justifyContent: 'center', paddingHorizontal: GAP },
});

export interface CutoutToolbarProps {
  labels: CutoutLabels;
  tool: CutoutTool;
  onTool: (tool: CutoutTool) => void;
  zoom: number;
  onZoom: (direction: number) => void;
  radius: number;
  onRadius: (radius: number) => void;
  disabled: boolean;
  testID: string;
}

export const CutoutToolbar = ({ labels, tool, onTool, zoom, onZoom, radius, onRadius, disabled, testID }: CutoutToolbarProps): React.ReactElement => {
  const { theme } = useUi();
  const toolButton = (value: CutoutTool, label: CutoutControlLabel): React.ReactElement => (
    <View key={value} style={styles.grow}>
      <Button accessibilityHint={label.hint} accessibilityLabel={label.label} autoLoading={false} disabled={disabled} label={label.label} testID={`${testID}-tool-${value}`} variant={tool === value ? 'primary' : 'outline'} onPress={() => onTool(value)} />
    </View>
  );
  const zoomButton = (direction: number, glyph: string, label: CutoutControlLabel, id: string): React.ReactElement => (
    <Button accessibilityHint={label.hint} accessibilityLabel={label.label} autoLoading={false} disabled={disabled || !canStepZoom(zoom, direction)} label={glyph} testID={`${testID}-${id}`} variant="outline" onPress={() => onZoom(direction)} />
  );

  return (
    <FormGrid gap={GAP}>
      <FormCell basis={TOOL_CELL}>
        <Field label={labels.brush}>
          <View accessibilityRole="radiogroup" style={styles.row}>
            {toolButton(CutoutTool.Keep, labels.keep)}
            {toolButton(CutoutTool.Erase, labels.erase)}
            {toolButton(CutoutTool.Move, labels.move)}
          </View>
        </Field>
      </FormCell>
      <FormCell basis={ZOOM_CELL} grow={false}>
        <Field label={labels.zoom}>
          <View style={styles.row}>
            {zoomButton(-1, '−', labels.zoomOut, 'zoom-out')}
            <Text style={[styles.readout, { color: theme.colors.text }]} testID={`${testID}-zoom`}>
              {labels.zoomValue(Math.round(zoom * PERCENT))}
            </Text>
            {zoomButton(1, '+', labels.zoomIn, 'zoom-in')}
          </View>
        </Field>
      </FormCell>
      <FormCell basis={SIZE_CELL}>
        <Field label={labels.brushSize}>
          <View style={[styles.slider, { borderColor: theme.colors.border }]}>
            <input
              aria-description={labels.brushSizeControl.hint}
              aria-label={labels.brushSizeControl.label}
              data-testid={`${testID}-brush-size`}
              disabled={disabled || tool === CutoutTool.Move}
              max={CUTOUT_BRUSH_RADIUS.max}
              min={CUTOUT_BRUSH_RADIUS.min}
              style={{ width: '100%', minHeight: MIN_TARGET_PX, accentColor: theme.colors.text }}
              type="range"
              value={radius}
              onChange={(event) => onRadius(clampBrushRadius(Number(event.currentTarget.value)))}
            />
          </View>
        </Field>
      </FormCell>
    </FormGrid>
  );
};
