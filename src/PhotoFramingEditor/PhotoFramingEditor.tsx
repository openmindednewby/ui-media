/**
 * PhotoFramingEditor — the KEFI-PEOPLE-1 "A2" framing screen: a live preview of
 * the consumer's own card (render prop) beside a zoom stepper and a position
 * d-pad. The value is `{x, y, scale}`, clamped to PHOTO_FRAMING_BOUNDS, the same
 * rules the public landing page applies — the preview is what ships.
 *
 * Narrow first: preview stacked over the controls; from ui-layout's
 * LAYOUT_COLLAPSE_BREAKPOINT up they sit side by side.
 */
import React, { useCallback, useMemo } from 'react';

import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { LAYOUT_COLLAPSE_BREAKPOINT } from '@dloizides/ui-layout';

import type { FramingAction } from '../framing/FramingAction';
import { clampFraming, framingToTransform } from '../framing/photoFraming';
import { stepFraming } from '../framing/stepFraming';
import { FramingControls } from './FramingControls';
import { PhotoAnchor, resolvePhotoAnchor } from './PhotoAnchor';
import type { PhotoFramingEditorProps } from './types';

const GAP = 16;

const styles = StyleSheet.create({
  root: { flexDirection: 'column', gap: GAP, alignItems: 'stretch' },
  rootWide: { flexDirection: 'row', alignItems: 'flex-start' },
  preview: { alignItems: 'center', overflow: 'hidden' },
  previewWide: { flexShrink: 1 },
});

export const PhotoFramingEditor = ({
  value,
  onChange,
  renderPreview,
  labels,
  testID,
  steps,
  renderGlyph,
  disabled = false,
  anchor = PhotoAnchor.Center,
}: PhotoFramingEditorProps): React.ReactElement => {
  const { width } = useWindowDimensions();
  const wide = width >= LAYOUT_COLLAPSE_BREAKPOINT;
  const framing = useMemo(() => clampFraming(value), [value]);
  const transform = useMemo(() => framingToTransform(framing), [framing]);
  const anchorLayout = useMemo(() => resolvePhotoAnchor(anchor), [anchor]);

  const onAction = useCallback(
    (action: FramingAction): void => onChange(stepFraming(framing, action, steps)),
    [framing, onChange, steps],
  );

  return (
    <View style={[styles.root, wide ? styles.rootWide : null]} testID={testID}>
      <View
        style={[styles.preview, { justifyContent: anchorLayout.justifyContent }, wide ? styles.previewWide : null]}
        testID={`${testID}-preview`}
      >
        {renderPreview({ framing, transform, anchor, objectPosition: anchorLayout.objectPosition })}
      </View>
      <FramingControls
        disabled={disabled}
        framing={framing}
        labels={labels}
        renderGlyph={renderGlyph}
        steps={steps}
        testID={testID}
        onAction={onAction}
      />
    </View>
  );
};
