import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Button } from '@dloizides/ui-buttons';
import { MODAL_OVERLAY_COLOR, useUi } from '@dloizides/ui-feedback';

import { CutoutLayout } from './CutoutLayout';
import type { CutoutPoint } from './cutoutMath';
import { CUTOUT_BRUSH_RADIUS, CUTOUT_ZOOM, clampPan, fitStage, formatSeconds, resolveCutoutLayout, stepZoom } from './cutoutMath';
import { CutoutPhase } from './CutoutPhase';
import { CutoutStage } from './CutoutStage';
import { CutoutTool } from './CutoutTool';
import { CutoutToolbar } from './CutoutToolbar';
import type { CutoutEngine, CutoutLabels } from './types';
import { useCutoutSession } from './useCutoutSession';
import { useObjectUrl } from './useObjectUrl';

const MAX_WIDTH = 1100;
const PAD_WIDE = 20;
const PAD_NARROW = 16;
const GAP = 12;
const RADIUS = 12;
const TITLE_SIZE = 18;
const BODY_SIZE = 14;
const STAGE_HEIGHT_SHARE = 0.55;
const HALF_SPLIT = 0.5;
const ORIGIN: CutoutPoint = { x: 0, y: 0 };

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: MAX_WIDTH, maxHeight: '100%', borderRadius: RADIUS },
  body: { gap: GAP },
  title: { fontSize: TITLE_SIZE, fontWeight: '700' },
  sub: { fontSize: BODY_SIZE },
  status: { flexDirection: 'row', alignItems: 'center', gap: GAP },
  actions: { flexDirection: 'row', gap: GAP },
  grow: { flexGrow: 1, flexBasis: 0 },
});

export interface CutoutDialogProps {
  engine: CutoutEngine;
  image: Blob;
  labels: CutoutLabels;
  onDone: (cutout: Blob | null) => void;
  testID?: string;
}

/** The Compare dialog: original beside (or split against) the cut-out, Keep / Erase / Move brush, then Use cut-out. */
export const CutoutDialog = ({ engine, image, labels, onDone, testID = 'cutout-dialog' }: CutoutDialogProps): React.ReactElement => {
  const { theme } = useUi();
  const { width, height } = useWindowDimensions();
  const session = useCutoutSession(engine, image);
  const imageUri = useObjectUrl(image);
  const [tool, setTool] = useState<CutoutTool>(CutoutTool.Erase);
  const [zoom, setZoom] = useState<number>(CUTOUT_ZOOM.min);
  const [pan, setPan] = useState<CutoutPoint>(ORIGIN);
  const [split, setSplit] = useState(HALF_SPLIT);
  const [radius, setRadius] = useState<number>(CUTOUT_BRUSH_RADIUS.initial);
  const layout = resolveCutoutLayout(width);
  const pad = layout === CutoutLayout.SideBySide ? PAD_WIDE : PAD_NARROW;
  const inner = Math.min(width, MAX_WIDTH) - pad * 2 - pad * 2;
  const paneWidth = layout === CutoutLayout.SideBySide ? (inner - GAP) / 2 : inner;
  const mask = session.cut?.mask;
  const stage = useMemo(
    () => fitStage({ width: paneWidth, height: height * STAGE_HEIGHT_SHARE }, { width: mask?.width ?? 0, height: mask?.height ?? 0 }),
    [paneWidth, height, mask],
  );
  const ready = session.phase === CutoutPhase.Ready;
  const saving = session.phase === CutoutPhase.Saving;
  const useId = `${testID}-use`;

  useEffect(() => {
    if (ready && typeof document !== 'undefined') document.querySelector<HTMLElement>(`[data-testid="${useId}"]`)?.focus();
  }, [ready, useId]);

  const onZoom = useCallback((direction: number) => {
    const next = stepZoom(zoom, direction);
    setZoom(next);
    setPan((current) => clampPan(current, next, stage));
  }, [zoom, stage]);
  const onUse = useCallback(async () => onDone(await session.apply()), [onDone, session]);
  const onCancel = useCallback(() => onDone(null), [onDone]);

  const status = ready && session.cut !== null ? labels.summary(formatSeconds(session.cut.elapsedMs)) : null;
  return (
    <Modal transparent visible animationType="none" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: MODAL_OVERLAY_COLOR, padding: pad }]}>
        <View accessibilityLabel={labels.title} accessibilityRole="none" aria-modal role="dialog" style={[styles.card, { backgroundColor: theme.colors.surface }]} testID={testID}>
          <ScrollView contentContainerStyle={[styles.body, { padding: pad }]}>
            <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.text }]}>{labels.title}</Text>
            {session.phase === CutoutPhase.Cutting ? (
              <View accessibilityLiveRegion="polite" style={styles.status} testID={`${testID}-cutting`}>
                <ActivityIndicator color={theme.colors.text} />
                <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{labels.cutting}</Text>
              </View>
            ) : null}
            {status !== null ? <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>{status}</Text> : null}
            {session.phase === CutoutPhase.Failed ? (
              <Text accessibilityLiveRegion="polite" style={[styles.sub, { color: theme.semantic.error['500'] }]} testID={`${testID}-failed`}>{labels.failed}</Text>
            ) : null}
            {session.cut !== null && imageUri !== null ? (
              <CutoutStage cut={session.cut} engine={engine} imageUri={imageUri} labels={labels} layout={layout} pan={pan} radius={radius} split={split} stage={stage} testID={testID} tool={tool} zoom={zoom} onPan={setPan} onSplit={setSplit} />
            ) : null}
            <CutoutToolbar disabled={!ready} labels={labels} radius={radius} testID={testID} tool={tool} zoom={zoom} onRadius={setRadius} onTool={setTool} onZoom={onZoom} />
            <View style={styles.actions}>
              <View style={styles.grow}>
                <Button accessibilityHint={labels.use.hint} accessibilityLabel={labels.use.label} autoLoading={false} disabled={!ready} label={labels.use.label} loading={saving} testID={useId} variant="primary" onPress={onUse} />
              </View>
              <View style={styles.grow}>
                <Button accessibilityHint={labels.cancel.hint} accessibilityLabel={labels.cancel.label} autoLoading={false} disabled={saving} label={labels.cancel.label} testID={`${testID}-cancel`} variant="outline" onPress={onCancel} />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
